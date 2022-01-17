package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtapeTransitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtapeTransition.class);
        EtapeTransition etapeTransition1 = new EtapeTransition();
        etapeTransition1.setId(1L);
        EtapeTransition etapeTransition2 = new EtapeTransition();
        etapeTransition2.setId(etapeTransition1.getId());
        assertThat(etapeTransition1).isEqualTo(etapeTransition2);
        etapeTransition2.setId(2L);
        assertThat(etapeTransition1).isNotEqualTo(etapeTransition2);
        etapeTransition1.setId(null);
        assertThat(etapeTransition1).isNotEqualTo(etapeTransition2);
    }
}
