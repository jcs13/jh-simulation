package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParcoursDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParcoursDefinition.class);
        ParcoursDefinition parcoursDefinition1 = new ParcoursDefinition();
        parcoursDefinition1.setId(1L);
        ParcoursDefinition parcoursDefinition2 = new ParcoursDefinition();
        parcoursDefinition2.setId(parcoursDefinition1.getId());
        assertThat(parcoursDefinition1).isEqualTo(parcoursDefinition2);
        parcoursDefinition2.setId(2L);
        assertThat(parcoursDefinition1).isNotEqualTo(parcoursDefinition2);
        parcoursDefinition1.setId(null);
        assertThat(parcoursDefinition1).isNotEqualTo(parcoursDefinition2);
    }
}
