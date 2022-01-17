package com.poc.simulation.web.rest;

import com.poc.simulation.domain.BlocDefinition;
import com.poc.simulation.repository.BlocDefinitionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.BlocDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlocDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(BlocDefinitionResource.class);

    private static final String ENTITY_NAME = "blocDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlocDefinitionRepository blocDefinitionRepository;

    public BlocDefinitionResource(BlocDefinitionRepository blocDefinitionRepository) {
        this.blocDefinitionRepository = blocDefinitionRepository;
    }

    /**
     * {@code POST  /bloc-definitions} : Create a new blocDefinition.
     *
     * @param blocDefinition the blocDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blocDefinition, or with status {@code 400 (Bad Request)} if the blocDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bloc-definitions")
    public ResponseEntity<BlocDefinition> createBlocDefinition(@Valid @RequestBody BlocDefinition blocDefinition)
        throws URISyntaxException {
        log.debug("REST request to save BlocDefinition : {}", blocDefinition);
        if (blocDefinition.getId() != null) {
            throw new BadRequestAlertException("A new blocDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlocDefinition result = blocDefinitionRepository.save(blocDefinition);
        return ResponseEntity
            .created(new URI("/api/bloc-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bloc-definitions/:id} : Updates an existing blocDefinition.
     *
     * @param id the id of the blocDefinition to save.
     * @param blocDefinition the blocDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocDefinition,
     * or with status {@code 400 (Bad Request)} if the blocDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blocDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bloc-definitions/{id}")
    public ResponseEntity<BlocDefinition> updateBlocDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BlocDefinition blocDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update BlocDefinition : {}, {}", id, blocDefinition);
        if (blocDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlocDefinition result = blocDefinitionRepository.save(blocDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bloc-definitions/:id} : Partial updates given fields of an existing blocDefinition, field will ignore if it is null
     *
     * @param id the id of the blocDefinition to save.
     * @param blocDefinition the blocDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blocDefinition,
     * or with status {@code 400 (Bad Request)} if the blocDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the blocDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the blocDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bloc-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlocDefinition> partialUpdateBlocDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BlocDefinition blocDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlocDefinition partially : {}, {}", id, blocDefinition);
        if (blocDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blocDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlocDefinition> result = blocDefinitionRepository
            .findById(blocDefinition.getId())
            .map(existingBlocDefinition -> {
                if (blocDefinition.getName() != null) {
                    existingBlocDefinition.setName(blocDefinition.getName());
                }
                if (blocDefinition.getLabel() != null) {
                    existingBlocDefinition.setLabel(blocDefinition.getLabel());
                }

                return existingBlocDefinition;
            })
            .map(blocDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blocDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /bloc-definitions} : get all the blocDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blocDefinitions in body.
     */
    @GetMapping("/bloc-definitions")
    public List<BlocDefinition> getAllBlocDefinitions() {
        log.debug("REST request to get all BlocDefinitions");
        return blocDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /bloc-definitions/:id} : get the "id" blocDefinition.
     *
     * @param id the id of the blocDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blocDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bloc-definitions/{id}")
    public ResponseEntity<BlocDefinition> getBlocDefinition(@PathVariable Long id) {
        log.debug("REST request to get BlocDefinition : {}", id);
        Optional<BlocDefinition> blocDefinition = blocDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blocDefinition);
    }

    /**
     * {@code DELETE  /bloc-definitions/:id} : delete the "id" blocDefinition.
     *
     * @param id the id of the blocDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bloc-definitions/{id}")
    public ResponseEntity<Void> deleteBlocDefinition(@PathVariable Long id) {
        log.debug("REST request to delete BlocDefinition : {}", id);
        blocDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
