# Respuestas a las Preguntas Técnicas

## 1. Habrás observado que las llamadas al servicio para obtener el listado de Municipios son bastante lentas. ¿Cómo haríamos para mejorar el tiempo de respuesta de este servicio? (ten en cuenta que el listado de municipios no cambia con frecuencia).

Como el listado de municipios no suele cambiar, podemos ahorrar tiempo de respuesta al cliente almacenando en caché la respuesta con los códigos y nombre de todas las localidades registradas en la API. Además, de esta forma, reduciríamos el número de llamadas a la API, por lo que conseguimos retrasar alcanzar el límite de peticiones con el que cuenta.

Para implementar esta caché habría que importar al proyecto spring-boot-starter-cache y el motor de caché caffeine. Luego tendríamos que añadirle la anotación @Cacheable al método que se encarga de realizar la petición a la API y transformar el resultado.

```java
@Cacheable(value = "municipalities", unless = "#result.isEmpty()")
public List<Municipality> findAll() {
    return aemetClient.fetchMunicipalities();
}
```

Este caché se llenaría al arrancar el programa así:

```java
@EventListener(ApplicationReadyEvent.class)
public void preloadMunicipalities() {
    municipalityRepository.findAll();
}
```

En cuanto a la duración de la caché, se le podría dar una duración especifica, tras la cual se elimina y se vuelve a pedir a la API. Aunque la mejor opción, pero depediente de AEMET, sería que notificarán de alguna forma cuando se produce un cambio y actualizar la caché solo al producirse cambios.

## 2. Notarás además que el servicio para recuperar la predicción para un municipio devuelve una URL a la que hacer la consulta. ¿Por qué motivo piensas que AEMET ha implementado este servicio así?

De esta forma pueden separar la solicitud del recurso, de la infraestructura que entrega los datos. En la primera se gestionan cosas como la autenticación del cliente y su cuota de uso, mientras que la segunda se encarga de la transferencia de información mediante archivos pesados.Al estar separadas se les puede asignar recursos y balacear la carga de forma independiente.

## 3. A nuestros usuarios les ha gustado la aplicación, pero les parece muy engorroso tener que indicar cada vez que acceden a la aplicación el municipio donde se encuentran para consultar la previsión del tiempo. Les gustaría que se recordara el último municipio seleccionado y que automáticamente les cargue la predicción del día siguiente. ¿Cómo lo podríamos hacer?

Para guardar el municipio seleccionado (tanto el nombre para mostrarlo en el campo de búsqueda como el código para realizar la petición de predicción) utilizariamos localStorage. Para ello habría que crear un servicio encargado de guardar y actualizar el valor seleccionado al utilizar la aplicación. Posteriormente, al cargar la página, mediante ese servicio se consultaría localStorage para obtener ese valor, asignarselo a la variable adecuada y realizar la consulta al back para cargar los datos.

## 4. La aplicación está teniendo tanto éxito que estamos causando una carga excesiva en el servicio de AEMET.Tras la amenaza de AEMET con cortarnos el servicio, debemos apresurarnos a buscar alguna solución que afecte lo mínimo posible a nuestros usuarios. ¿Qué podríamos hacer? ¿Cómo implementarías la solución?

En primer lugar, es posible que muchos de los usuarios consulten el tiempo en las misma localidades, por lo que podríamos cachear la predicción de cada localidad conforme el primer cliente la consulte, evitando así peticiones para consultar los mismos datos. Como la AEMET informa de que la previsión se actualiza continuamente esta caché si que tendría que tener un tiempo de vida más corto.

Además, implementaría un mecanismo propio de limitación de llamadas en nuestro backend, evitando que se propague a la API de AEMET. Según su documentación, permite hacer 40 peticiones por minuto, por lo que nosotros podríamos poner el mismo límite en nuestro back y que cuando se supere, devolvamos nosotros el error 429 sin tener que llamar a la AEMET con Bucket4j.

También podríamos controlar las llamadas a la API de la AEMET y cuando fallen varias seguidas, dejar de llamar a la API con un Circuit Breaker mediante la librería Resilience4j.

Por otro lado, la AEMET también dispone de otra llamada en la que te devuelve la predicción para todas las localidades a la vez. Se podría utilizar esa llamada para cargar todas las previsiones y mostrarselas a los usuarios hasta una nueva actualización de los datos, similar a como se trataría la llamada a los municipios en la primera pregunta. De esta forma, las peticiones de los clientes no conllevarían peticiones a la API de la AEMET, si no consultas a los últimos datos obtenidos de ella.
