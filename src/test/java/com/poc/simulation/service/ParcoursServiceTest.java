package com.poc.simulation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poc.simulation.domain.Etape;
import com.poc.simulation.domain.EtapeTransition;
import com.poc.simulation.domain.Parcours;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
        final List<EtapeTransition> etapeOrders = mapper.readValue(
            new File("src/test/resources/data/etape-orders.json"),
            new TypeReference<List<EtapeTransition>>() {}
        );

        log.info("etapes init");
        etapeOrders.forEach(etape -> log.info("{}", etape));

        final List<EtapeTransition> asproeTotoEtapeTransitions = etapeOrders
            .stream()
            .filter(etapeOrder -> etapeOrder.getParcoursDefinition().getName().equals("asproe-toto"))
            .sorted(Comparator.comparing(EtapeTransition::getTransition))
            .collect(Collectors.toList());
        final List<EtapeTransition> asproeEtapeOrders = etapeOrders
            .stream()
            .filter(etapeOrder -> etapeOrder.getParcoursDefinition().getName().equals("asproe"))
            .sorted(Comparator.comparing(EtapeTransition::getTransition))
            .collect(Collectors.toList());
        final List<EtapeTransition> coreEtapeOrders = etapeOrders
            .stream()
            .filter(etapeOrder -> etapeOrder.getParcoursDefinition().getName().equals("core"))
            .sorted(Comparator.comparing(EtapeTransition::getTransition))
            .collect(Collectors.toList());

        List<EtapeTransition> etapeOrderCoreToChild = new ArrayList<>();
        etapeOrderCoreToChild.addAll(coreEtapeOrders);
        etapeOrderCoreToChild.addAll(asproeEtapeOrders);
        etapeOrderCoreToChild.addAll(asproeTotoEtapeTransitions);

        log.info("etapes sorted");
        etapeOrderCoreToChild.forEach(etape -> log.info("{}", etape));

        final List<Etape> etapes = parcoursService.buildOrderedEtapes(parcours, etapeOrderCoreToChild);

        String jsonStr = mapper.writeValueAsString(etapes);

        log.info(jsonStr);

        log.info("etapes ordonnees");
        etapes.forEach(etape -> log.info("{}", etape));
    }
}
