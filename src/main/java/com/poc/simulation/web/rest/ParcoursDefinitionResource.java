package com.poc.simulation.web.rest;

import com.poc.simulation.domain.ParcoursDefinition;
import com.poc.simulation.repository.ParcoursDefinitionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.ParcoursDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParcoursDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(ParcoursDefinitionResource.class);

    private static final String ENTITY_NAME = "parcoursDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParcoursDefinitionRepository parcoursDefinitionRepository;

    public ParcoursDefinitionResource(ParcoursDefinitionRepository parcoursDefinitionRepository) {
        this.parcoursDefinitionRepository = parcoursDefinitionRepository;
    }

    /**
     * {@code POST  /parcours-definitions} : Create a new parcoursDefinition.
     *
     * @param parcoursDefinition the parcoursDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parcoursDefinition, or with status {@code 400 (Bad Request)} if the parcoursDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parcours-definitions")
    public ResponseEntity<ParcoursDefinition> createParcoursDefinition(@Valid @RequestBody ParcoursDefinition parcoursDefinition)
        throws URISyntaxException {
        log.debug("REST request to save ParcoursDefinition : {}", parcoursDefinition);
        if (parcoursDefinition.getId() != null) {
            throw new BadRequestAlertException("A new parcoursDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParcoursDefinition result = parcoursDefinitionRepository.save(parcoursDefinition);
        return ResponseEntity
            .created(new URI("/api/parcours-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parcours-definitions/:id} : Updates an existing parcoursDefinition.
     *
     * @param id the id of the parcoursDefinition to save.
     * @param parcoursDefinition the parcoursDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcoursDefinition,
     * or with status {@code 400 (Bad Request)} if the parcoursDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parcoursDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parcours-definitions/{id}")
    public ResponseEntity<ParcoursDefinition> updateParcoursDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ParcoursDefinition parcoursDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update ParcoursDefinition : {}, {}", id, parcoursDefinition);
        if (parcoursDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcoursDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParcoursDefinition result = parcoursDefinitionRepository.save(parcoursDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcoursDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parcours-definitions/:id} : Partial updates given fields of an existing parcoursDefinition, field will ignore if it is null
     *
     * @param id the id of the parcoursDefinition to save.
     * @param parcoursDefinition the parcoursDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcoursDefinition,
     * or with status {@code 400 (Bad Request)} if the parcoursDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the parcoursDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the parcoursDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parcours-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParcoursDefinition> partialUpdateParcoursDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ParcoursDefinition parcoursDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParcoursDefinition partially : {}, {}", id, parcoursDefinition);
        if (parcoursDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcoursDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParcoursDefinition> result = parcoursDefinitionRepository
            .findById(parcoursDefinition.getId())
            .map(existingParcoursDefinition -> {
                if (parcoursDefinition.getName() != null) {
                    existingParcoursDefinition.setName(parcoursDefinition.getName());
                }
                if (parcoursDefinition.getLabel() != null) {
                    existingParcoursDefinition.setLabel(parcoursDefinition.getLabel());
                }

                return existingParcoursDefinition;
            })
            .map(parcoursDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcoursDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /parcours-definitions} : get all the parcoursDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parcoursDefinitions in body.
     */
    @GetMapping("/parcours-definitions")
    public List<ParcoursDefinition> getAllParcoursDefinitions() {
        log.debug("REST request to get all ParcoursDefinitions");
        return parcoursDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /parcours-definitions/:id} : get the "id" parcoursDefinition.
     *
     * @param id the id of the parcoursDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parcoursDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parcours-definitions/{id}")
    public ResponseEntity<ParcoursDefinition> getParcoursDefinition(@PathVariable Long id) {
        log.debug("REST request to get ParcoursDefinition : {}", id);
        Optional<ParcoursDefinition> parcoursDefinition = parcoursDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parcoursDefinition);
    }

    /**
     * {@code DELETE  /parcours-definitions/:id} : delete the "id" parcoursDefinition.
     *
     * @param id the id of the parcoursDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parcours-definitions/{id}")
    public ResponseEntity<Void> deleteParcoursDefinition(@PathVariable Long id) {
        log.debug("REST request to delete ParcoursDefinition : {}", id);
        parcoursDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
