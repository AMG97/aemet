package com.agap2.aemet.presentation.mapper;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.presentation.dto.MunicipalityResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class MunicipalityMapperTest {

    private final MunicipalityMapper mapper = new MunicipalityMapper();

    @Test
    void toResponse_mapsCodeAndName() {
        Municipality municipality = new Municipality("30022", "Jumilla");
        
        MunicipalityResponse response = mapper.toResponse(municipality);
        
        assertThat(response.code()).isEqualTo("30022");
        assertThat(response.name()).isEqualTo("Jumilla");
    }

    @Test
    void toResponseList_mapsAllMunicipalities() {
        List<Municipality> municipalities = List.of(
            new Municipality("30022", "Jumilla"),
            new Municipality("18111", "Jun"),
            new Municipality("29064", "Jubrique")
        );
        
        List<MunicipalityResponse> responses = mapper.toResponseList(municipalities);
        
        assertThat(responses).hasSize(3);
        assertThat(responses.get(0).code()).isEqualTo("30022");
        assertThat(responses.get(0).name()).isEqualTo("Jumilla");
        assertThat(responses.get(1).code()).isEqualTo("18111");
        assertThat(responses.get(1).name()).isEqualTo("Jun");
        assertThat(responses.get(2).code()).isEqualTo("29064");
        assertThat(responses.get(2).name()).isEqualTo("Jubrique");
    }

    @Test
    void toResponseList_emptyList_returnsEmpty() {
        List<MunicipalityResponse> responses = mapper.toResponseList(List.of());
        
        assertThat(responses).isEmpty();
    }
}