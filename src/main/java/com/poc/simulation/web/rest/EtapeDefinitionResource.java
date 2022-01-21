package com.poc.simulation.web.rest;

import com.poc.simulation.domain.EtapeDefinition;
import com.poc.simulation.repository.EtapeDefinitionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.EtapeDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EtapeDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(EtapeDefinitionResource.class);

    private static final String ENTITY_NAME = "etapeDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtapeDefinitionRepository etapeDefinitionRepository;

    public EtapeDefinitionResource(EtapeDefinitionRepository etapeDefinitionRepository) {
        this.etapeDefinitionRepository = etapeDefinitionRepository;
    }

    /**
     * {@code POST  /etape-definitions} : Create a new etapeDefinition.
     *
     * @param etapeDefinition the etapeDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etapeDefinition, or with status {@code 400 (Bad Request)} if the etapeDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/etape-definitions")
    public ResponseEntity<EtapeDefinition> createEtapeDefinition(@Valid @RequestBody EtapeDefinition etapeDefinition)
        throws URISyntaxException {
        log.debug("REST request to save EtapeDefinition : {}", etapeDefinition);
        if (etapeDefinition.getId() != null) {
            throw new BadRequestAlertException("A new etapeDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EtapeDefinition result = etapeDefinitionRepository.save(etapeDefinition);
        return ResponseEntity
            .created(new URI("/api/etape-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /etape-definitions/:id} : Updates an existing etapeDefinition.
     *
     * @param id the id of the etapeDefinition to save.
     * @param etapeDefinition the etapeDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeDefinition,
     * or with status {@code 400 (Bad Request)} if the etapeDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etapeDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/etape-definitions/{id}")
    public ResponseEntity<EtapeDefinition> updateEtapeDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EtapeDefinition etapeDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update EtapeDefinition : {}, {}", id, etapeDefinition);
        if (etapeDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EtapeDefinition result = etapeDefinitionRepository.save(etapeDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /etape-definitions/:id} : Partial updates given fields of an existing etapeDefinition, field will ignore if it is null
     *
     * @param id the id of the etapeDefinition to save.
     * @param etapeDefinition the etapeDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etapeDefinition,
     * or with status {@code 400 (Bad Request)} if the etapeDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the etapeDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the etapeDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/etape-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EtapeDefinition> partialUpdateEtapeDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EtapeDefinition etapeDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update EtapeDefinition partially : {}, {}", id, etapeDefinition);
        if (etapeDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etapeDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etapeDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EtapeDefinition> result = etapeDefinitionRepository
            .findById(etapeDefinition.getId())
            .map(existingEtapeDefinition -> {
                if (etapeDefinition.getName() != null) {
                    existingEtapeDefinition.setName(etapeDefinition.getName());
                }
                if (etapeDefinition.getLabel() != null) {
                    existingEtapeDefinition.setLabel(etapeDefinition.getLabel());
                }
                if (etapeDefinition.getDisplay() != null) {
                    existingEtapeDefinition.setDisplay(etapeDefinition.getDisplay());
                }

                return existingEtapeDefinition;
            })
            .map(etapeDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etapeDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /etape-definitions} : get all the etapeDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etapeDefinitions in body.
     */
    @GetMapping("/etape-definitions")
    public List<EtapeDefinition> getAllEtapeDefinitions() {
        log.debug("REST request to get all EtapeDefinitions");
        return etapeDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /etape-definitions/:id} : get the "id" etapeDefinition.
     *
     * @param id the id of the etapeDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etapeDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/etape-definitions/{id}")
    public ResponseEntity<EtapeDefinition> getEtapeDefinition(@PathVariable Long id) {
        log.debug("REST request to get EtapeDefinition : {}", id);
        Optional<EtapeDefinition> etapeDefinition = etapeDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(etapeDefinition);
    }

    /**
     * {@code DELETE  /etape-definitions/:id} : delete the "id" etapeDefinition.
     *
     * @param id the id of the etapeDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/etape-definitions/{id}")
    public ResponseEntity<Void> deleteEtapeDefinition(@PathVariable Long id) {
        log.debug("REST request to delete EtapeDefinition : {}", id);
        etapeDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
