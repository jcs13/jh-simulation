package com.poc.simulation.service;

import com.poc.simulation.domain.*;
import com.poc.simulation.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ParcoursService {

    private final Logger log = LoggerFactory.getLogger(ParcoursService.class);

    @Autowired
    private OffreRepository offreRepository;

    @Autowired
    private ParcoursRepository parcoursRepository;

    @Autowired
    private ParcoursCompositionRepository offreParcoursCompositionRepository;

    @Autowired
    private EtapeTransitionRepository etapeTransitionRepository;

    @Autowired
    private BlocTransitionRepository blocTransitionRepository;

    public Parcours instanciateParcoursByOffre(String offerName) {
        log.debug("START instanciateParcoursByOffre");
        log.debug("offerName={}", offerName);


        final Optional<Offre> offre = offreRepository.findById(1L);

        log.info("offre {}", offre);


        Parcours parcours = new Parcours().name("parcours name").label("parcours pour offre " + offerName).offreId("1");

        ParcoursComposition opcFilter = new ParcoursComposition().offre(new Offre().name(offerName));
        final List<ParcoursComposition> parcoursCompositionsFromOffre = offreParcoursCompositionRepository.findAll(
            Example.of(opcFilter)
        );

        final ParcoursComposition parcoursComposition = parcoursCompositionsFromOffre.get(0);

        final ParcoursDefinition parcoursParent = parcoursComposition.getParcoursParent();
        EtapeTransition etapeTransitionParentFilter = new EtapeTransition().parcoursDefinition(parcoursParent);
        List<EtapeTransition> etapeTransitionsParents = etapeTransitionRepository.findAll(Example.of(etapeTransitionParentFilter));
        etapeTransitionsParents.sort(Comparator.comparing(EtapeTransition::getTransition));

        final ParcoursDefinition parcoursChild = parcoursComposition.getParcoursChild();
        EtapeTransition etapeTransitionChildFilter = new EtapeTransition().parcoursDefinition(parcoursChild);
        List<EtapeTransition> etapeTransitionsChild = etapeTransitionRepository.findAll(Example.of(etapeTransitionChildFilter));
        etapeTransitionsChild.sort(Comparator.comparing(EtapeTransition::getTransition));

        List<EtapeTransition> etapeTransitions = new ArrayList<>();
        etapeTransitions.addAll(etapeTransitionsParents);
        etapeTransitions.addAll(etapeTransitionsChild);

        List<Etape> etapes = buildOrderedEtapes(parcours, etapeTransitions);
        parcours.setEtapes(Set.copyOf(etapes));

        List<ParcoursDefinition> parcoursDefinitionComposition = new ArrayList<>();
        parcoursDefinitionComposition.add(parcoursParent);
        parcoursDefinitionComposition.add(parcoursChild);


        parcoursDefinitionComposition.forEach(parcoursDefinition -> {

        });

//        BlocTransition blocOrderFilterByParcoursDefEtapeDef = new BlocTransition().parcoursDefinition(parcoursParent);
//        final List<BlocTransition> blocOrders = blocTransitionRepository.findAll(Example.of(blocOrderFilterByParcoursDefEtapeDef));


        etapes.forEach(etape -> {

//            etape.blocs(buildOrderedBlocs(etape.get, etape.getEtapeDefinitionId()));
        });



        etapes.forEach(etape -> log.info("{}", etape));

        log.debug("STOP instanciateParcoursByOffre");

        return parcoursRepository.save(parcours);
    }

    private Set<Bloc> buildOrderedBlocs(ParcoursDefinition parcoursDefinition, EtapeDefinition etapeDefinition) {
        BlocTransition blocOrderFilterByParcoursDefEtapeDef = new BlocTransition()
            .parcoursDefinition(parcoursDefinition)
            .etapeDefinition(etapeDefinition);
        final List<BlocTransition> blocOrders = blocTransitionRepository.findAll(Example.of(blocOrderFilterByParcoursDefEtapeDef));
        List<BlocDefinition> blocDefinitionsOrdered = new ArrayList<>();
        blocOrders.forEach(blocOrder -> {
            orderingLinkedElements(blocDefinitionsOrdered, blocOrder.getCurrent(), blocOrder.getNext());
        });

        List<Bloc> blocs = convertBlocDefinitionsToBlocs(etapeDefinition, blocDefinitionsOrdered);

        log.info("blocs = {}", blocs);

        return Set.copyOf(blocs);
    }

    public List<Etape> buildOrderedEtapes(Parcours parcours, List<EtapeTransition> etapeTransitions) {
        List<EtapeDefinition> etapeDefinitionOrdered = new ArrayList<>();
        etapeTransitions.forEach(EtapeTransition -> {
            orderingLinkedElements(etapeDefinitionOrdered, EtapeTransition.getCurrent(), EtapeTransition.getNext());
        });

        return convertEtapeDefinitionsToEtapes(parcours, etapeDefinitionOrdered);
    }

    private List<Etape> convertEtapeDefinitionsToEtapes(Parcours parcours, List<EtapeDefinition> etapeDefinitionOrdered) {
        AtomicInteger atomicInteger = new AtomicInteger(0);
        return etapeDefinitionOrdered
            .stream()
            .map(etapeDefinition -> buildEtapeFromDefinition(parcours, etapeDefinition, atomicInteger.getAndIncrement()))
            .collect(Collectors.toList());
    }

    private Etape buildEtapeFromDefinition(Parcours parcours, EtapeDefinition etapeDefinition, int order) {
//        List<BlocDefinition> blodDefs = findBlocDefinitionFromEtapeDefinition(etapeDefinition);

        return new Etape()
            .name(etapeDefinition.getName())
            .label(etapeDefinition.getLabel())
            .order(order)
            .etapeDefinitionId(etapeDefinition.getId().toString())
            .parcours(parcours);
    }

    private List<Bloc> convertBlocDefinitionsToBlocs(EtapeDefinition etapeDefinition, List<BlocDefinition> blocDefinitionsOrdered) {
        List<Bloc> blocs = blocDefinitionsOrdered
            .stream()
            .map(blocDefinition -> buildBlocFromDefinition(etapeDefinition, blocDefinition))
            .collect(Collectors.toList());
        return blocs;
    }

    private void orderingLinkedElements(List elements, Object current, Object next) {
        if (elements.isEmpty()) {
            elements.add(current);
            elements.add(next);
        } else if (elements.contains(current)) {
            final int idxCurrent = elements.indexOf(current);
            elements.add(idxCurrent + 1, next);
        } else if (elements.contains(next)) {
            final int idxNext = elements.indexOf(next);
            elements.add(idxNext > 0 ? idxNext - 1 : 0, current);
        }
    }

    private Bloc buildBlocFromDefinition(EtapeDefinition etapeDefinition, BlocDefinition blocDefinition) {
        Bloc bloc = new Bloc()
            .name(blocDefinition.getName())
            .label(blocDefinition.getName())
            .etapeDefinitionId(etapeDefinition.getId().toString())
            .blocDefinitionId(blocDefinition.getId().toString())
            .elementName(blocDefinition.getElement().getName())
            .elementPath(blocDefinition.getElement().getPath());
        return bloc;
    }

}
