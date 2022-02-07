package com.poc.simulation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poc.simulation.domain.*;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class ParcoursServiceTest {

    private final Logger log = LoggerFactory.getLogger(ParcoursServiceTest.class);

    @Test
    void instanciateParcoursByOffre() {}

    @Test
    void buildOrderedEtapes() throws IOException {
        ParcoursService parcoursService = new ParcoursService();
        Parcours parcours = new Parcours();
        parcours.setId(121L);
        parcours.setName("test");
        parcours.setLabel("parcours de test");
        parcours.setOffreId("BVC");
        ObjectMapper mapper = new ObjectMapper();
        final List<EtapeTransition> etapeTransitions = mapper.readValue(
            new File("src/test/resources/data/etape-transitions.json"),
            new TypeReference<List<EtapeTransition>>() {}
        );

        log.info("etapes init");
        etapeTransitions.forEach(etape -> log.info("{}", etape));

        List<OffreComposition> offresCompositions = new ArrayList<>();
        final List<Etape> etapes = parcoursService.buildEtapes(offresCompositions, etapeTransitions);

        String jsonStr = mapper.writeValueAsString(etapes);

        log.info(jsonStr);

        log.info("etapes ordonnees");
        etapes.forEach(etape -> log.info("{}", etape));
    }

    @Test
    void buildOrderedBlocs() throws IOException {
        ParcoursService parcoursService = new ParcoursService();
        Parcours parcours = new Parcours();
        parcours.setId(121L);
        parcours.setName("test");
        parcours.setLabel("parcours de test");
        parcours.setOffreId("BVC");
        ObjectMapper mapper = new ObjectMapper();
        final List<BlocTransition> blocTransitions = mapper.readValue(
            new File("src/test/resources/data/bloc-transitions.json"),
            new TypeReference<List<BlocTransition>>() {}
        );

        log.info("init");
        blocTransitions.forEach(bloc -> log.info("{}", bloc));

        Etape etape = new Etape()
            .id(1L)
            .name("etape 1")
            .label("etape info clients")
            .etapeDefinitionId("123")
            .parcours(parcours)
            .display(true);
        List<Bloc> blocs = parcoursService.buildBlocs(etape, blocTransitions);

        String jsonStr = mapper.writeValueAsString(blocs);

        log.info(jsonStr);

        log.info("bloc ordonnees");
        blocs.forEach(bloc -> log.info("{}", bloc));
    }
}
