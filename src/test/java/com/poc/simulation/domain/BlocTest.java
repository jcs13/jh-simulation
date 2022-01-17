package com.poc.simulation.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.poc.simulation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlocTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bloc.class);
        Bloc bloc1 = new Bloc();
        bloc1.setId(1L);
        Bloc bloc2 = new Bloc();
        bloc2.setId(bloc1.getId());
        assertThat(bloc1).isEqualTo(bloc2);
        bloc2.setId(2L);
        assertThat(bloc1).isNotEqualTo(bloc2);
        bloc1.setId(null);
        assertThat(bloc1).isNotEqualTo(bloc2);
    }
}
