package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlocDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlocDefinition.class);
        BlocDefinition blocDefinition1 = new BlocDefinition();
        blocDefinition1.setId(1L);
        BlocDefinition blocDefinition2 = new BlocDefinition();
        blocDefinition2.setId(blocDefinition1.getId());
        assertThat(blocDefinition1).isEqualTo(blocDefinition2);
        blocDefinition2.setId(2L);
        assertThat(blocDefinition1).isNotEqualTo(blocDefinition2);
        blocDefinition1.setId(null);
        assertThat(blocDefinition1).isNotEqualTo(blocDefinition2);
    }
}
