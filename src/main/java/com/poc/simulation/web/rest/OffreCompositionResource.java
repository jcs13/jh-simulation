package com.poc.simulation.web.rest;

import com.poc.simulation.domain.OffreComposition;
import com.poc.simulation.repository.OffreCompositionRepository;
import com.poc.simulation.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.poc.simulation.domain.OffreComposition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OffreCompositionResource {

    private final Logger log = LoggerFactory.getLogger(OffreCompositionResource.class);

    private static final String ENTITY_NAME = "offreComposition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OffreCompositionRepository offreCompositionRepository;

    public OffreCompositionResource(OffreCompositionRepository offreCompositionRepository) {
        this.offreCompositionRepository = offreCompositionRepository;
    }

    /**
     * {@code POST  /offre-compositions} : Create a new offreComposition.
     *
     * @param offreComposition the offreComposition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offreComposition, or with status {@code 400 (Bad Request)} if the offreComposition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offre-compositions")
    public ResponseEntity<OffreComposition> createOffreComposition(@Valid @RequestBody OffreComposition offreComposition)
        throws URISyntaxException {
        log.debug("REST request to save OffreComposition : {}", offreComposition);
        if (offreComposition.getId() != null) {
            throw new BadRequestAlertException("A new offreComposition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OffreComposition result = offreCompositionRepository.save(offreComposition);
        return ResponseEntity
            .created(new URI("/api/offre-compositions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offre-compositions/:id} : Updates an existing offreComposition.
     *
     * @param id the id of the offreComposition to save.
     * @param offreComposition the offreComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreComposition,
     * or with status {@code 400 (Bad Request)} if the offreComposition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offreComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offre-compositions/{id}")
    public ResponseEntity<OffreComposition> updateOffreComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OffreComposition offreComposition
    ) throws URISyntaxException {
        log.debug("REST request to update OffreComposition : {}, {}", id, offreComposition);
        if (offreComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OffreComposition result = offreCompositionRepository.save(offreComposition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offreComposition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offre-compositions/:id} : Partial updates given fields of an existing offreComposition, field will ignore if it is null
     *
     * @param id the id of the offreComposition to save.
     * @param offreComposition the offreComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreComposition,
     * or with status {@code 400 (Bad Request)} if the offreComposition is not valid,
     * or with status {@code 404 (Not Found)} if the offreComposition is not found,
     * or with status {@code 500 (Internal Server Error)} if the offreComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offre-compositions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OffreComposition> partialUpdateOffreComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OffreComposition offreComposition
    ) throws URISyntaxException {
        log.debug("REST request to partial update OffreComposition partially : {}, {}", id, offreComposition);
        if (offreComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OffreComposition> result = offreCompositionRepository
            .findById(offreComposition.getId())
            .map(existingOffreComposition -> {
                if (offreComposition.getInheritanceOrder() != null) {
                    existingOffreComposition.setInheritanceOrder(offreComposition.getInheritanceOrder());
                }

                return existingOffreComposition;
            })
            .map(offreCompositionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offreComposition.getId().toString())
        );
    }

    /**
     * {@code GET  /offre-compositions} : get all the offreCompositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offreCompositions in body.
     */
    @GetMapping("/offre-compositions")
    public List<OffreComposition> getAllOffreCompositions() {
        log.debug("REST request to get all OffreCompositions");
        return offreCompositionRepository.findAll();
    }

    /**
     * {@code GET  /offre-compositions/:id} : get the "id" offreComposition.
     *
     * @param id the id of the offreComposition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offreComposition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offre-compositions/{id}")
    public ResponseEntity<OffreComposition> getOffreComposition(@PathVariable Long id) {
        log.debug("REST request to get OffreComposition : {}", id);
        Optional<OffreComposition> offreComposition = offreCompositionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offreComposition);
    }

    /**
     * {@code DELETE  /offre-compositions/:id} : delete the "id" offreComposition.
     *
     * @param id the id of the offreComposition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offre-compositions/{id}")
    public ResponseEntity<Void> deleteOffreComposition(@PathVariable Long id) {
        log.debug("REST request to delete OffreComposition : {}", id);
        offreCompositionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
