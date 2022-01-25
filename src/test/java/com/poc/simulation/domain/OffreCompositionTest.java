package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffreCompositionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffreComposition.class);
        OffreComposition offreComposition1 = new OffreComposition();
        offreComposition1.setId(1L);
        OffreComposition offreComposition2 = new OffreComposition();
        offreComposition2.setId(offreComposition1.getId());
        assertThat(offreComposition1).isEqualTo(offreComposition2);
        offreComposition2.setId(2L);
        assertThat(offreComposition1).isNotEqualTo(offreComposition2);
        offreComposition1.setId(null);
        assertThat(offreComposition1).isNotEqualTo(offreComposition2);
    }
}
