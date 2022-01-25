package com.poc.simulation.service;

import com.poc.simulation.domain.*;
import com.poc.simulation.repository.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

@Service
public class ParcoursService {

    private final Logger log = LoggerFactory.getLogger(ParcoursService.class);

    @Autowired
    private OffreRepository offreRepository;

    @Autowired
    private ParcoursRepository parcoursRepository;

    @Autowired
    private OffreCompositionRepository offreCompositionRepository;

    @Autowired
    private EtapeTransitionRepository etapeTransitionRepository;

    @Autowired
    private BlocTransitionRepository blocTransitionRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
        (new DateTimeFormatterBuilder()).parseCaseInsensitive()
            .append(DateTimeFormatter.BASIC_ISO_DATE)
            .appendLiteral('-')
            .appendValue(ChronoField.HOUR_OF_DAY, 2)
            .appendValue(ChronoField.MINUTE_OF_HOUR, 2)
            .optionalStart()
            .appendValue(ChronoField.SECOND_OF_MINUTE, 2)
            .optionalStart()
            .toFormatter(Locale.FRANCE);

    public Parcours instanciateParcoursByOffre(String offerName) {
        log.info("START instanciateParcoursByOffre");
        log.debug("offerName={}", offerName);

        final Optional<Offre> offre = offreRepository.findById(1L);

        log.debug("offre {}", offre);

        final OffreComposition offreComposition = getOffreComposition(offerName);

        List<EtapeTransition> etapeTransitions = getEtapeTransitions(offreComposition);

        List<Etape> etapes = buildEtapes(etapeTransitions);

        Parcours parcoursToSave = buildParcours(offreComposition, etapes);

        log.debug("save parcours");
        Parcours parcours = parcoursRepository.save(parcoursToSave);

        log.info("STOP instanciateParcoursByOffre");

        return parcours;
    }

    private List<EtapeTransition> getEtapeTransitions(OffreComposition offreComposition) {
        log.debug("get etape transitions");
        List<EtapeTransition> etapeTransitions = new ArrayList<>();

        List<EtapeTransition> etapeTransitionsParents = getEtapeTransitionsFromParcours(offreComposition.getParcoursParent());
        etapeTransitions.addAll(etapeTransitionsParents);

        List<EtapeTransition> etapeTransitionsChild = getEtapeTransitionsFromParcours(offreComposition.getParcoursChild());
        etapeTransitions.addAll(etapeTransitionsChild);

        return etapeTransitions;
    }

    private List<EtapeTransition> getEtapeTransitionsFromParcours(ParcoursDefinition parcoursParent2) {
        log.debug("get etape transitions from parcours");
        final ParcoursDefinition parcoursParent = parcoursParent2;
        EtapeTransition etapeTransitionParentFilter = new EtapeTransition().parcoursDefinition(parcoursParent);
        List<EtapeTransition> etapeTransitionsParents = etapeTransitionRepository.findAll(Example.of(etapeTransitionParentFilter));
        etapeTransitionsParents.sort(Comparator.comparing(EtapeTransition::getTransition));
        return etapeTransitionsParents;
    }

    private OffreComposition getOffreComposition(String offerName) {
        log.debug("get offre composition");
        OffreComposition opcFilter = new OffreComposition().offre(new Offre().name(offerName));
        final List<OffreComposition> offreCompositions = offreCompositionRepository.findAll(Example.of(opcFilter));

        final OffreComposition offreComposition = offreCompositions.get(0);
        return offreComposition;
    }

    public List<Etape> buildEtapes(List<EtapeTransition> etapeTransitions) {
        log.debug("build etapes");
        List<EtapeDefinition> etapeDefinitionOrdered = new ArrayList<>();
        etapeTransitions.forEach(etapeTransition -> {
            orderingLinkedElements(etapeDefinitionOrdered, etapeTransition.getCurrent(), etapeTransition.getNext());
        });
        return convertEtapeDefinitionsToEtapes(etapeDefinitionOrdered);
    }

    private List<Etape> convertEtapeDefinitionsToEtapes(List<EtapeDefinition> etapeDefinitionOrdered) {
        log.debug("convert etapes definitions to etapes");
        AtomicInteger atomicInteger = new AtomicInteger(0);
        return etapeDefinitionOrdered
            .stream()
            .map(etapeDefinition -> buildEtapeFromDefinition(etapeDefinition, atomicInteger.getAndIncrement()))
            .collect(Collectors.toList());
    }

    private Etape buildEtapeFromDefinition(EtapeDefinition etapeDefinition, int order) {
        log.debug("build etape from definition");
        return new Etape()
            .name(etapeDefinition.getName())
            .label(etapeDefinition.getLabel())
            .order(order)
            .etapeDefinitionId(etapeDefinition.getId().toString())
            .display(etapeDefinition.getDisplay());
    }

    private Parcours buildParcours(OffreComposition offreComposition, List<Etape> etapes) {
        log.debug("build parcours");

        String dateTime = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        String offerName = offreComposition.getOffre().getName();

        Parcours parcours = new Parcours()
            .name("parcours " + offerName + " - " + dateTime)
            .label("parcours pour offre " + offerName + " - " + dateTime)
            .offreId("1");

        etapes.forEach(etape -> {
            List<BlocTransition> blocTransitions = getBlocTransitionsFromEtapeParcoursDef(offreComposition, etape);
            parcours.addEtape(etape);
            List<Bloc> blocs = buildBlocs(etape, blocTransitions);
            blocs.forEach(bloc -> etape.addBloc(bloc));
        });
        return parcours;
    }

    private List<BlocTransition> getBlocTransitionsFromEtapeParcoursDef(OffreComposition offreComposition, Etape etape) {
        log.debug("get bloc transitions from etape");
        List<BlocTransition> blocTransitionParcoursEtapes = new ArrayList<>();

        final List<BlocTransition> blocTransitionParcoursEtapesParent = getBlocTransitionsFromEtapeParcoursDef(
            etape,
            offreComposition.getParcoursParent()
        );
        blocTransitionParcoursEtapes.addAll(blocTransitionParcoursEtapesParent);

        final List<BlocTransition> blocTransitionParcoursEtapesChild = getBlocTransitionsFromEtapeParcoursDef(
            etape,
            offreComposition.getParcoursChild()
        );
        blocTransitionParcoursEtapes.addAll(blocTransitionParcoursEtapesChild);

        return blocTransitionParcoursEtapes;
    }

    private List<BlocTransition> getBlocTransitionsFromEtapeParcoursDef(Etape etape, ParcoursDefinition parcoursDefinition) {
        log.debug("get bloc transitions from etape + parcours definition");
        final ParcoursDefinition parcoursChild = parcoursDefinition;
        return blocTransitionRepository.findByParcoursAndEtapesOrderByTransition(
            parcoursChild,
            new EtapeDefinition().id(Long.valueOf(etape.getEtapeDefinitionId()))
        );
    }

    public List<Bloc> buildBlocs(Etape etape, List<BlocTransition> blocTransitionParcoursEtapes) {
        log.debug("build blocs");
        List<BlocDefinition> blocDefinitionsOrdered = new ArrayList<>();
        blocTransitionParcoursEtapes.forEach(blocOrder -> {
            orderingLinkedElements(blocDefinitionsOrdered, blocOrder.getCurrent(), blocOrder.getNext());
        });
        return convertBlocDefinitionsToBlocs(etape, blocDefinitionsOrdered);
    }

    private List<Bloc> convertBlocDefinitionsToBlocs(Etape etape, List<BlocDefinition> blocDefinitionsOrdered) {
        log.debug("convert bloc definitions to blocs");
        AtomicInteger atomicInteger = new AtomicInteger(0);
        return blocDefinitionsOrdered
            .stream()
            .map(blocDefinition -> buildBlocFromDefinition(etape, blocDefinition, atomicInteger.getAndIncrement()))
            .collect(Collectors.toList());
    }

    private Bloc buildBlocFromDefinition(Etape etape, BlocDefinition blocDefinition, int order) {
        log.debug("build bloc from bloc definition");
        Bloc bloc = new Bloc()
            .name(blocDefinition.getName())
            .label(blocDefinition.getName())
            .order(order)
            .display(blocDefinition.getDisplay())
            .etapeDefinitionId(etape.getEtapeDefinitionId())
            .blocDefinitionId(blocDefinition.getId().toString())
            .elementName(blocDefinition.getElement().getName())
            .elementPath(blocDefinition.getElement().getPath())
            .etape(etape);
        return bloc;
    }

    private void orderingLinkedElements(List elements, Object current, Object next) {
        log.debug("ordering linked elements");
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
}
