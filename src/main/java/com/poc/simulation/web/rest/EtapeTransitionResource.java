package com.poc.simulation.web.rest;

import com.poc.simulation.domain.EtapeTransition;
import com.poc.simulation.repository.EtapeTransitionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.EtapeTransition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EtapeTransitionResource {

    private final Logger log = LoggerFactory.getLogger(EtapeTransitionResource.class);

    private static final String ENTITY_NAME = "etapeTransition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtapeTransitionRepository etapeTransitionRepository;

    public EtapeTransitionResource(EtapeTransitionRepository etapeTransitionRepository) {
        this.etapeTransitionRepository = etapeTransitionRepository;
    }

    /**
     * {@code POST  /etape-transitions} : Create a new etapeTransition.
     *
     * @param etapeTransition the etapeTransition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etapeTransition, or with status {@code 400 (Bad Request)} if the etapeTransition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/etape-transitions")
    public ResponseEntity<EtapeTransition> createEtapeTransition(@Valid @RequestBody EtapeTransition etapeTransition)
        throws URISyntaxException {
        log.debug("REST request to save EtapeTransition : {}", etapeTransition);
        if (etapeTransition.getId() != null) {
            throw new BadRequestAlertException("A new etapeTransition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EtapeTransition result = etapeTransitionRepository.save(etapeTransition);
        return ResponseEntity
            .created(new URI("/api/etape-transitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /etape-transitions/:id} : Updates an existing etapeTransition.
     *
     * @param id the id of the etapeTransition to save.
     * @param etapeTransition the etapeTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeTransition,
     * or with status {@code 400 (Bad Request)} if the etapeTransition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etapeTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/etape-transitions/{id}")
    public ResponseEntity<EtapeTransition> updateEtapeTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EtapeTransition etapeTransition
    ) throws URISyntaxException {
        log.debug("REST request to update EtapeTransition : {}, {}", id, etapeTransition);
        if (etapeTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EtapeTransition result = etapeTransitionRepository.save(etapeTransition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeTransition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /etape-transitions/:id} : Partial updates given fields of an existing etapeTransition, field will ignore if it is null
     *
     * @param id the id of the etapeTransition to save.
     * @param etapeTransition the etapeTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeTransition,
     * or with status {@code 400 (Bad Request)} if the etapeTransition is not valid,
     * or with status {@code 404 (Not Found)} if the etapeTransition is not found,
     * or with status {@code 500 (Internal Server Error)} if the etapeTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/etape-transitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EtapeTransition> partialUpdateEtapeTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EtapeTransition etapeTransition
    ) throws URISyntaxException {
        log.debug("REST request to partial update EtapeTransition partially : {}, {}", id, etapeTransition);
        if (etapeTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EtapeTransition> result = etapeTransitionRepository
            .findById(etapeTransition.getId())
            .map(existingEtapeTransition -> {
                if (etapeTransition.getTransition() != null) {
                    existingEtapeTransition.setTransition(etapeTransition.getTransition());
                }

                return existingEtapeTransition;
            })
            .map(etapeTransitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeTransition.getId().toString())
        );
    }

    /**
     * {@code GET  /etape-transitions} : get all the etapeTransitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etapeTransitions in body.
     */
    @GetMapping("/etape-transitions")
    public List<EtapeTransition> getAllEtapeTransitions() {
        log.debug("REST request to get all EtapeTransitions");
        return etapeTransitionRepository.findAll();
    }

    /**
     * {@code GET  /etape-transitions/:id} : get the "id" etapeTransition.
     *
     * @param id the id of the etapeTransition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etapeTransition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/etape-transitions/{id}")
    public ResponseEntity<EtapeTransition> getEtapeTransition(@PathVariable Long id) {
        log.debug("REST request to get EtapeTransition : {}", id);
        Optional<EtapeTransition> etapeTransition = etapeTransitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(etapeTransition);
    }

    /**
     * {@code DELETE  /etape-transitions/:id} : delete the "id" etapeTransition.
     *
     * @param id the id of the etapeTransition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/etape-transitions/{id}")
    public ResponseEntity<Void> deleteEtapeTransition(@PathVariable Long id) {
        log.debug("REST request to delete EtapeTransition : {}", id);
        etapeTransitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
