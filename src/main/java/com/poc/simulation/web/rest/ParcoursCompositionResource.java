package com.poc.simulation.web.rest;

import com.poc.simulation.domain.ParcoursComposition;
import com.poc.simulation.repository.ParcoursCompositionRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.ParcoursComposition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParcoursCompositionResource {

    private final Logger log = LoggerFactory.getLogger(ParcoursCompositionResource.class);

    private static final String ENTITY_NAME = "parcoursComposition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParcoursCompositionRepository parcoursCompositionRepository;

    public ParcoursCompositionResource(ParcoursCompositionRepository parcoursCompositionRepository) {
        this.parcoursCompositionRepository = parcoursCompositionRepository;
    }

    /**
     * {@code POST  /parcours-compositions} : Create a new parcoursComposition.
     *
     * @param parcoursComposition the parcoursComposition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parcoursComposition, or with status {@code 400 (Bad Request)} if the parcoursComposition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parcours-compositions")
    public ResponseEntity<ParcoursComposition> createParcoursComposition(@Valid @RequestBody ParcoursComposition parcoursComposition)
        throws URISyntaxException {
        log.debug("REST request to save ParcoursComposition : {}", parcoursComposition);
        if (parcoursComposition.getId() != null) {
            throw new BadRequestAlertException("A new parcoursComposition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParcoursComposition result = parcoursCompositionRepository.save(parcoursComposition);
        return ResponseEntity
            .created(new URI("/api/parcours-compositions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parcours-compositions/:id} : Updates an existing parcoursComposition.
     *
     * @param id the id of the parcoursComposition to save.
     * @param parcoursComposition the parcoursComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcoursComposition,
     * or with status {@code 400 (Bad Request)} if the parcoursComposition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parcoursComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parcours-compositions/{id}")
    public ResponseEntity<ParcoursComposition> updateParcoursComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ParcoursComposition parcoursComposition
    ) throws URISyntaxException {
        log.debug("REST request to update ParcoursComposition : {}, {}", id, parcoursComposition);
        if (parcoursComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcoursComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParcoursComposition result = parcoursCompositionRepository.save(parcoursComposition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcoursComposition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parcours-compositions/:id} : Partial updates given fields of an existing parcoursComposition, field will ignore if it is null
     *
     * @param id the id of the parcoursComposition to save.
     * @param parcoursComposition the parcoursComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcoursComposition,
     * or with status {@code 400 (Bad Request)} if the parcoursComposition is not valid,
     * or with status {@code 404 (Not Found)} if the parcoursComposition is not found,
     * or with status {@code 500 (Internal Server Error)} if the parcoursComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parcours-compositions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParcoursComposition> partialUpdateParcoursComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ParcoursComposition parcoursComposition
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParcoursComposition partially : {}, {}", id, parcoursComposition);
        if (parcoursComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcoursComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParcoursComposition> result = parcoursCompositionRepository
            .findById(parcoursComposition.getId())
            .map(existingParcoursComposition -> {
                if (parcoursComposition.getInheritanceOrder() != null) {
                    existingParcoursComposition.setInheritanceOrder(parcoursComposition.getInheritanceOrder());
                }

                return existingParcoursComposition;
            })
            .map(parcoursCompositionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcoursComposition.getId().toString())
        );
    }

    /**
     * {@code GET  /parcours-compositions} : get all the parcoursCompositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parcoursCompositions in body.
     */
    @GetMapping("/parcours-compositions")
    public List<ParcoursComposition> getAllParcoursCompositions() {
        log.debug("REST request to get all ParcoursCompositions");
        return parcoursCompositionRepository.findAll();
    }

    /**
     * {@code GET  /parcours-compositions/:id} : get the "id" parcoursComposition.
     *
     * @param id the id of the parcoursComposition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parcoursComposition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parcours-compositions/{id}")
    public ResponseEntity<ParcoursComposition> getParcoursComposition(@PathVariable Long id) {
        log.debug("REST request to get ParcoursComposition : {}", id);
        Optional<ParcoursComposition> parcoursComposition = parcoursCompositionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parcoursComposition);
    }

    /**
     * {@code DELETE  /parcours-compositions/:id} : delete the "id" parcoursComposition.
     *
     * @param id the id of the parcoursComposition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parcours-compositions/{id}")
    public ResponseEntity<Void> deleteParcoursComposition(@PathVariable Long id) {
        log.debug("REST request to delete ParcoursComposition : {}", id);
        parcoursCompositionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
