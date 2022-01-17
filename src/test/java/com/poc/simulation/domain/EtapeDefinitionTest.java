package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtapeDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtapeDefinition.class);
        EtapeDefinition etapeDefinition1 = new EtapeDefinition();
        etapeDefinition1.setId(1L);
        EtapeDefinition etapeDefinition2 = new EtapeDefinition();
        etapeDefinition2.setId(etapeDefinition1.getId());
        assertThat(etapeDefinition1).isEqualTo(etapeDefinition2);
        etapeDefinition2.setId(2L);
        assertThat(etapeDefinition1).isNotEqualTo(etapeDefinition2);
        etapeDefinition1.setId(null);
        assertThat(etapeDefinition1).isNotEqualTo(etapeDefinition2);
    }
}
