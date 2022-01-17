package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParcoursCompositionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParcoursComposition.class);
        ParcoursComposition parcoursComposition1 = new ParcoursComposition();
        parcoursComposition1.setId(1L);
        ParcoursComposition parcoursComposition2 = new ParcoursComposition();
        parcoursComposition2.setId(parcoursComposition1.getId());
        assertThat(parcoursComposition1).isEqualTo(parcoursComposition2);
        parcoursComposition2.setId(2L);
        assertThat(parcoursComposition1).isNotEqualTo(parcoursComposition2);
        parcoursComposition1.setId(null);
        assertThat(parcoursComposition1).isNotEqualTo(parcoursComposition2);
    }
}
