package com.agap2.aemet.infrastructure.repository;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.infrastructure.client.AemetClient;
import com.agap2.aemet.infrastructure.dto.AemetMunicipality;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AemetMunicipalityRepositoryImplTest {

    @Mock
    AemetClient aemetClient;

    AemetMunicipalityRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository = new AemetMunicipalityRepositoryImpl(aemetClient);
    }

    @Test
    void findAll_mapsAndReturnsMunicipalities() {
        AemetMunicipality m1 = new AemetMunicipality("id30022", "Jumilla");
        AemetMunicipality m2 = new AemetMunicipality("id18111", "Jun");
        
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of(m1, m2));

        List<Municipality> result = repository.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).code()).isEqualTo("30022");
        assertThat(result.get(0).name()).isEqualTo("Jumilla");
        assertThat(result.get(1).code()).isEqualTo("18111");
        assertThat(result.get(1).name()).isEqualTo("Jun");
    }

    @Test
    void findAll_emptyResponse_returnsEmpty() {
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of());

        List<Municipality> result = repository.findAll();

        assertThat(result).isEmpty();
    }

    @Test
    void searchByNamePrefix_filtersByPrefix() {
        AemetMunicipality m1 = new AemetMunicipality("id30022", "Jumilla");
        AemetMunicipality m2 = new AemetMunicipality("id18111", "Jun");
        AemetMunicipality m3 = new AemetMunicipality("id28079", "Madrid");
        
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of(m1, m2, m3));

        List<Municipality> result = repository.searchByNamePrefix("Ju");

        assertThat(result).hasSize(2);
        assertThat(result).extracting(Municipality::name)
            .containsExactlyInAnyOrder("Jumilla", "Jun");
    }

    @Test
    void searchByNamePrefix_caseInsensitive() {
        AemetMunicipality m1 = new AemetMunicipality("id30022", "Jumilla");
        AemetMunicipality m2 = new AemetMunicipality("id18111", "jun");
        
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of(m1, m2));

        List<Municipality> result = repository.searchByNamePrefix("JU");

        assertThat(result).hasSize(2);
    }

    @Test
    void searchByNamePrefix_emptyPrefix_returnsAll() {
        AemetMunicipality m1 = new AemetMunicipality("id30022", "Jumilla");
        
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of(m1));

        List<Municipality> result = repository.searchByNamePrefix("");

        assertThat(result).hasSize(1);
    }

    @Test
    void searchByNamePrefix_noMatches_returnsEmpty() {
        AemetMunicipality m1 = new AemetMunicipality("id30022", "Jumilla");
        
        when(aemetClient.getMunicipalitiesList()).thenReturn(List.of(m1));

        List<Municipality> result = repository.searchByNamePrefix("XYZ");

        assertThat(result).isEmpty();
    }
}