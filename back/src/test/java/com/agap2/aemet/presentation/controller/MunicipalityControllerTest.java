package com.agap2.aemet.presentation.controller;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.presentation.dto.MunicipalityResponse;
import com.agap2.aemet.application.usecases.SearchMunicipalitiesByPrefixUseCase;
import com.agap2.aemet.presentation.mapper.MunicipalityMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MunicipalityController.class)
class MunicipalityControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    SearchMunicipalitiesByPrefixUseCase useCase;

    @MockitoBean
    MunicipalityMapper municipalityMapper;

    @Test
    void search_returnsMappedList() throws Exception {
        Municipality m1 = new Municipality("30022", "Jumilla");
        Municipality m2 = new Municipality("18111", "Jun");
        when(useCase.execute("Ju")).thenReturn(List.of(m1, m2));
        when(municipalityMapper.toResponseList(List.of(m1, m2)))
            .thenReturn(List.of(
                new MunicipalityResponse("30022", "Jumilla"),
                new MunicipalityResponse("18111", "Jun")
            ));

        mockMvc.perform(get("/api/v1/municipalities/search")
                .param("prefix", "Ju"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].codigo").value("30022"))
            .andExpect(jsonPath("$[0].nombre").value("Jumilla"))
            .andExpect(jsonPath("$[1].codigo").value("18111"))
            .andExpect(jsonPath("$[1].nombre").value("Jun"));
    }

    @Test
    void search_emptyResult_returnsEmptyArray() throws Exception {
        when(useCase.execute("XYZ")).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/municipalities/search")
                .param("prefix", "XYZ"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void search_missingPrefix_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/municipalities/search"))
            .andExpect(status().isBadRequest());
    }
}