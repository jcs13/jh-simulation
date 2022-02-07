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

    public Parcours generateParcoursByOffre(Long offerId) {
        log.info("generate parcours by offre");

        final Offre offre = getOffreById(offerId);

        final List<OffreComposition> offreCompositions = getOffreCompositions(offerId);

        return buildParcours(offre, offreCompositions);
    }

    public Parcours instanciateParcours(Parcours parcoursToInstanciate) {
        log.info("instanciate parcours");
        return parcoursRepository.save(parcoursToInstanciate);
    }

    private Offre getOffreById(Long offerId) {
        log.debug("get offer by id={}", offerId);
        final Offre offre = offreRepository.findById(offerId).get();
        return offre;
    }

    private List<OffreComposition> getOffreCompositions(Long offerId) {
        log.debug("get offre composition");
        OffreComposition opcFilter = new OffreComposition().offre(new Offre().id(offerId));
        final List<OffreComposition> offreCompositions = offreCompositionRepository.findAll(Example.of(opcFilter));
        offreCompositions.sort(Comparator.comparing(OffreComposition::getInheritanceOrder));
        return offreCompositions;
    }

    private Parcours buildParcours(Offre offre, List<OffreComposition> offreCompositions) {
        log.debug("build parcours");

        final String parcoursKey = offre.getName() + " - " + LocalDateTime.now().format(DATE_TIME_FORMATTER);

        Parcours parcours = new Parcours()
            .name("parcours " + parcoursKey)
            .label("parcours pour offre " + parcoursKey)
            .offreId(offre.getId().toString());

        final List<EtapeTransition> etapeTransitions = getEtapeTransitions(offreCompositions);
        final List<Etape> etapes = buildEtapes(offreCompositions, etapeTransitions);
        etapes.forEach(etape -> parcours.addEtape(etape));

        // Parcours => list<Etape> => list<Bloc>

        return parcours;
    }

    private List<EtapeTransition> getEtapeTransitions(List<OffreComposition> offreCompositions) {
        log.debug("get etape transitions");
        List<EtapeTransition> etapeTransitions = new ArrayList<>();

        offreCompositions.forEach(offreComposition -> {
            List<EtapeTransition> etapeTransitionsParents = getEtapeTransitionsFromParcours(offreComposition.getParcoursParent());
            etapeTransitions.addAll(etapeTransitionsParents);

            List<EtapeTransition> etapeTransitionsChild = getEtapeTransitionsFromParcours(offreComposition.getParcoursChild());
            etapeTransitions.addAll(etapeTransitionsChild);
        });

        // Liste des EtapesTransitions ordonnées avec : parcoursParent en 1er, puis parcoursChild en 2nd
        // liste retournée :
        // (parent) infos  -> config
        // (parent) config -> mdm
        // (parent) mdm    -> recap
        // (child)  config -> terminaux

        return etapeTransitions;
    }

    // liste ordonnées des objets EtapeTransition pour un parcoursDefinition donnée => depuis la BDD
    // select * from etape_transition where parcours_definition_id = 1 order by transition
    private List<EtapeTransition> getEtapeTransitionsFromParcours(ParcoursDefinition parcoursDefinition) {
        log.debug("get etape transitions from parcours");
        EtapeTransition etapeTransitionParentFilter = new EtapeTransition().parcoursDefinition(parcoursDefinition);
        List<EtapeTransition> etapeTransitionsParents = etapeTransitionRepository.findAll(Example.of(etapeTransitionParentFilter));
        etapeTransitionsParents.sort(Comparator.comparing(EtapeTransition::getTransition));
        return etapeTransitionsParents;
    }

    public List<Etape> buildEtapes(List<OffreComposition> offreCompositions, List<EtapeTransition> etapeTransitions) {
        log.debug("build etapes");

        // convertir liste<EtapeTransition> => liste<EtapeDefinition>

        List<EtapeDefinition> etapeDefinitionOrdered = new ArrayList<>();

        // boucle sur liste etapesTransitions
        // (parent) infos  -> config
        // (parent) config -> mdm
        // (parent) mdm    -> recap
        // (parent) recap  -> doc
        // (child)  config -> terminaux
        etapeTransitions.forEach(etapeTransition -> {
            orderingLinkedElements(etapeDefinitionOrdered, etapeTransition.getCurrent(), etapeTransition.getNext());
        });

        // liste EtapeDefinition : etapeDefinitionOrdered
        // infos
        // config
        // terminaux
        // mdm
        // recap
        // doc

        return convertEtapeDefinitionsToEtapes(offreCompositions, etapeDefinitionOrdered);
    }

    private List<Etape> convertEtapeDefinitionsToEtapes(
        List<OffreComposition> offreCompositions,
        List<EtapeDefinition> etapeDefinitionOrdered
    ) {
        log.debug("convert etapes definitions to etapes");
        AtomicInteger atomicInteger = new AtomicInteger(0);
        return etapeDefinitionOrdered
            .stream()
            .map(etapeDefinition -> buildEtapeFromDefinition(offreCompositions, etapeDefinition, atomicInteger.getAndIncrement()))
            .collect(Collectors.toList());
    }

    private Etape buildEtapeFromDefinition(List<OffreComposition> offreCompositions, EtapeDefinition etapeDefinition, int order) {
        log.debug("build etape from definition");

        Etape etape = new Etape()
            .name(etapeDefinition.getName())
            .label(etapeDefinition.getLabel())
            .order(order)
            .etapeDefinitionId(etapeDefinition.getId().toString())
            .display(etapeDefinition.getDisplay());

        // récupère la liste des BlocTransition ordonnées, avec d'abord parcoursParent puis parcoursChild
        List<BlocTransition> blocTransitions = getBlocTransitionsFromEtapeParcoursDef(offreCompositions, etape);
        // générer les objets Blocs (à persister) depuis chaque BlocTransition
        List<Bloc> blocs = buildBlocs(etape, blocTransitions);
        blocs.forEach(bloc -> etape.addBloc(bloc));

        return etape;
    }

    // select * from Bloc_transition where parcours_definition_id = X and etape_definition_id = Y order by transition
    private List<BlocTransition> getBlocTransitionsFromEtapeParcoursDef(List<OffreComposition> offreCompositions, Etape etape) {
        log.debug("get bloc transitions from etape");
        List<BlocTransition> blocTransitionParcoursEtapes = new ArrayList<>();

        offreCompositions.forEach(offreComposition -> {
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
        });

        return blocTransitionParcoursEtapes;
    }

    private List<BlocTransition> getBlocTransitionsFromEtapeParcoursDef(Etape etape, ParcoursDefinition parcoursDefinition) {
        log.debug("get bloc transitions from etape + parcours definition");
        return blocTransitionRepository.findByParcoursAndEtapesOrderByTransition(
            parcoursDefinition,
            new EtapeDefinition().id(Long.valueOf(etape.getEtapeDefinitionId()))
        );
    }

    public List<Bloc> buildBlocs(Etape etape, List<BlocTransition> blocTransitionParcoursEtapes) {
        log.debug("build blocs");
        List<BlocDefinition> blocDefinitionsOrdered = new ArrayList<>();
        // List<BlocTransition>
        //  - (parent) infos-client -> adresse
        //  - (parent) adresse -> mode paiement
        //  - (child)  adresse ->  eligibilite
        blocTransitionParcoursEtapes.forEach(blocOrder -> {
            orderingLinkedElements(blocDefinitionsOrdered, blocOrder.getCurrent(), blocOrder.getNext());
        });
        // List<BlocDefinition>
        //  - (parent) infos-client
        //  - (parent) adresse
        //  - (child)  eligibilite
        //  - (parent) mode paiement

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
        // list -> pre-info, info, configuration, terminaux, mdm, recap, gen-doc,
        if (elements.isEmpty()) {
            // init liste
            elements.add(current);
            elements.add(next);
        } else if (elements.contains(current)) {
            // insère l'objet "next", juste après le current (s'intercale)
            final int idxCurrent = elements.indexOf(current);
            elements.add(idxCurrent + 1, next);
        } else if (elements.contains(next)) {
            // insère l'objet 'current' juste avant le "next"
            final int idxNext = elements.indexOf(next);
            elements.add(idxNext > 0 ? idxNext - 1 : 0, current);
        }
        // (parent) 1ere boucle : (current : infos, next: config) => [infos, config]
        // (parent) 2eme boucle : (current : config, next: mdm) =>  [infos, config, mdm]
        // (parent) 3eme boucle : (current : mdm, next: recap) =>  [infos, config, mdm, recap]
        // (parent) 4eme boucle : (current : recap, next: doc) =>  [infos, config, mdm, recap, doc]
        // (child)  5eme boucle : (current : config, next: terminaux) =>  [infos, config, terminaux, mdm, recap, doc]

    }
}
