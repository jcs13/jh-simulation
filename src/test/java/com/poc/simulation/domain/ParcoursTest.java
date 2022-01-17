package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParcoursTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parcours.class);
        Parcours parcours1 = new Parcours();
        parcours1.setId(1L);
        Parcours parcours2 = new Parcours();
        parcours2.setId(parcours1.getId());
        assertThat(parcours1).isEqualTo(parcours2);
        parcours2.setId(2L);
        assertThat(parcours1).isNotEqualTo(parcours2);
        parcours1.setId(null);
        assertThat(parcours1).isNotEqualTo(parcours2);
    }
}
