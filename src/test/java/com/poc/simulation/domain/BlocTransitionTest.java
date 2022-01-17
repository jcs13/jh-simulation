package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlocTransitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlocTransition.class);
        BlocTransition blocTransition1 = new BlocTransition();
        blocTransition1.setId(1L);
        BlocTransition blocTransition2 = new BlocTransition();
        blocTransition2.setId(blocTransition1.getId());
        assertThat(blocTransition1).isEqualTo(blocTransition2);
        blocTransition2.setId(2L);
        assertThat(blocTransition1).isNotEqualTo(blocTransition2);
        blocTransition1.setId(null);
        assertThat(blocTransition1).isNotEqualTo(blocTransition2);
    }
}
