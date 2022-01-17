package com.poc.simulation.web.rest;

import com.poc.simulation.domain.BlocTransition;
import com.poc.simulation.repository.BlocTransitionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.BlocTransition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlocTransitionResource {

    private final Logger log = LoggerFactory.getLogger(BlocTransitionResource.class);

    private static final String ENTITY_NAME = "blocTransition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlocTransitionRepository blocTransitionRepository;

    public BlocTransitionResource(BlocTransitionRepository blocTransitionRepository) {
        this.blocTransitionRepository = blocTransitionRepository;
    }

    /**
     * {@code POST  /bloc-transitions} : Create a new blocTransition.
     *
     * @param blocTransition the blocTransition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blocTransition, or with status {@code 400 (Bad Request)} if the blocTransition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bloc-transitions")
    public ResponseEntity<BlocTransition> createBlocTransition(@Valid @RequestBody BlocTransition blocTransition)
        throws URISyntaxException {
        log.debug("REST request to save BlocTransition : {}", blocTransition);
        if (blocTransition.getId() != null) {
            throw new BadRequestAlertException("A new blocTransition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlocTransition result = blocTransitionRepository.save(blocTransition);
        return ResponseEntity
            .created(new URI("/api/bloc-transitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bloc-transitions/:id} : Updates an existing blocTransition.
     *
     * @param id the id of the blocTransition to save.
     * @param blocTransition the blocTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocTransition,
     * or with status {@code 400 (Bad Request)} if the blocTransition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blocTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bloc-transitions/{id}")
    public ResponseEntity<BlocTransition> updateBlocTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BlocTransition blocTransition
    ) throws URISyntaxException {
        log.debug("REST request to update BlocTransition : {}, {}", id, blocTransition);
        if (blocTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlocTransition result = blocTransitionRepository.save(blocTransition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocTransition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bloc-transitions/:id} : Partial updates given fields of an existing blocTransition, field will ignore if it is null
     *
     * @param id the id of the blocTransition to save.
     * @param blocTransition the blocTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocTransition,
     * or with status {@code 400 (Bad Request)} if the blocTransition is not valid,
     * or with status {@code 404 (Not Found)} if the blocTransition is not found,
     * or with status {@code 500 (Internal Server Error)} if the blocTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bloc-transitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlocTransition> partialUpdateBlocTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BlocTransition blocTransition
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlocTransition partially : {}, {}", id, blocTransition);
        if (blocTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlocTransition> result = blocTransitionRepository
            .findById(blocTransition.getId())
            .map(existingBlocTransition -> {
                if (blocTransition.getTransition() != null) {
                    existingBlocTransition.setTransition(blocTransition.getTransition());
                }

                return existingBlocTransition;
            })
            .map(blocTransitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocTransition.getId().toString())
        );
    }

    /**
     * {@code GET  /bloc-transitions} : get all the blocTransitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blocTransitions in body.
     */
    @GetMapping("/bloc-transitions")
    public List<BlocTransition> getAllBlocTransitions() {
        log.debug("REST request to get all BlocTransitions");
        return blocTransitionRepository.findAll();
    }

    /**
     * {@code GET  /bloc-transitions/:id} : get the "id" blocTransition.
     *
     * @param id the id of the blocTransition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blocTransition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bloc-transitions/{id}")
    public ResponseEntity<BlocTransition> getBlocTransition(@PathVariable Long id) {
        log.debug("REST request to get BlocTransition : {}", id);
        Optional<BlocTransition> blocTransition = blocTransitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blocTransition);
    }

    /**
     * {@code DELETE  /bloc-transitions/:id} : delete the "id" blocTransition.
     *
     * @param id the id of the blocTransition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bloc-transitions/{id}")
    public ResponseEntity<Void> deleteBlocTransition(@PathVariable Long id) {
        log.debug("REST request to delete BlocTransition : {}", id);
        blocTransitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
