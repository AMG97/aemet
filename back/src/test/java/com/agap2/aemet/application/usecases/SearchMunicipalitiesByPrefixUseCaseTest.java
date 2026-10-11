package com.agap2.aemet.application.usecases;

import com.agap2.aemet.domain.model.Municipality;
import com.agap2.aemet.domain.repository.MunicipalityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchMunicipalitiesByPrefixUseCaseTest {

    @Mock
    MunicipalityRepository repository;

    @Test
    void execute_delegatesToRepository() {
        List<Municipality> expected = List.of(
            new Municipality("30022", "Jumilla"),
            new Municipality("18111", "Jun")
        );
        when(repository.searchByNamePrefix("Ju")).thenReturn(expected);

        SearchMunicipalitiesByPrefixUseCase useCase = new SearchMunicipalitiesByPrefixUseCase(repository);
        List<Municipality> result = useCase.execute("Ju");

        assertThat(result).isEqualTo(expected);
        verify(repository).searchByNamePrefix("Ju");
    }

    @Test
    void execute_emptyPrefix_callsRepository() {
        when(repository.searchByNamePrefix("")).thenReturn(List.of());

        SearchMunicipalitiesByPrefixUseCase useCase = new SearchMunicipalitiesByPrefixUseCase(repository);
        List<Municipality> result = useCase.execute("");

        assertThat(result).isEmpty();
        verify(repository).searchByNamePrefix("");
    }
}