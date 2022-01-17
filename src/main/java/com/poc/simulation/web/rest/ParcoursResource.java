package com.poc.simulation.web.rest;

import com.poc.simulation.domain.Parcours;
import com.poc.simulation.repository.ParcoursRepository;
import com.poc.simulation.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.poc.simulation.domain.Parcours}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParcoursResource {

    private final Logger log = LoggerFactory.getLogger(ParcoursResource.class);

    private static final String ENTITY_NAME = "parcours";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParcoursRepository parcoursRepository;

    public ParcoursResource(ParcoursRepository parcoursRepository) {
        this.parcoursRepository = parcoursRepository;
    }

    /**
     * {@code POST  /parcours} : Create a new parcours.
     *
     * @param parcours the parcours to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parcours, or with status {@code 400 (Bad Request)} if the parcours has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parcours")
    public ResponseEntity<Parcours> createParcours(@Valid @RequestBody Parcours parcours) throws URISyntaxException {
        log.debug("REST request to save Parcours : {}", parcours);
        if (parcours.getId() != null) {
            throw new BadRequestAlertException("A new parcours cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parcours result = parcoursRepository.save(parcours);
        return ResponseEntity
            .created(new URI("/api/parcours/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parcours/:id} : Updates an existing parcours.
     *
     * @param id the id of the parcours to save.
     * @param parcours the parcours to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcours,
     * or with status {@code 400 (Bad Request)} if the parcours is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parcours couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parcours/{id}")
    public ResponseEntity<Parcours> updateParcours(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Parcours parcours
    ) throws URISyntaxException {
        log.debug("REST request to update Parcours : {}, {}", id, parcours);
        if (parcours.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcours.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Parcours result = parcoursRepository.save(parcours);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcours.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parcours/:id} : Partial updates given fields of an existing parcours, field will ignore if it is null
     *
     * @param id the id of the parcours to save.
     * @param parcours the parcours to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parcours,
     * or with status {@code 400 (Bad Request)} if the parcours is not valid,
     * or with status {@code 404 (Not Found)} if the parcours is not found,
     * or with status {@code 500 (Internal Server Error)} if the parcours couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parcours/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parcours> partialUpdateParcours(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Parcours parcours
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parcours partially : {}, {}", id, parcours);
        if (parcours.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parcours.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parcoursRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parcours> result = parcoursRepository
            .findById(parcours.getId())
            .map(existingParcours -> {
                if (parcours.getName() != null) {
                    existingParcours.setName(parcours.getName());
                }
                if (parcours.getLabel() != null) {
                    existingParcours.setLabel(parcours.getLabel());
                }
                if (parcours.getOffreId() != null) {
                    existingParcours.setOffreId(parcours.getOffreId());
                }

                return existingParcours;
            })
            .map(parcoursRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parcours.getId().toString())
        );
    }

    /**
     * {@code GET  /parcours} : get all the parcours.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parcours in body.
     */
    @GetMapping("/parcours")
    public List<Parcours> getAllParcours(@RequestParam(required = false) String filter) {
        if ("simulation-is-null".equals(filter)) {
            log.debug("REST request to get all Parcourss where simulation is null");
            return StreamSupport
                .stream(parcoursRepository.findAll().spliterator(), false)
                .filter(parcours -> parcours.getSimulation() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Parcours");
        return parcoursRepository.findAll();
    }

    /**
     * {@code GET  /parcours/:id} : get the "id" parcours.
     *
     * @param id the id of the parcours to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parcours, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parcours/{id}")
    public ResponseEntity<Parcours> getParcours(@PathVariable Long id) {
        log.debug("REST request to get Parcours : {}", id);
        Optional<Parcours> parcours = parcoursRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parcours);
    }

    /**
     * {@code DELETE  /parcours/:id} : delete the "id" parcours.
     *
     * @param id the id of the parcours to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parcours/{id}")
    public ResponseEntity<Void> deleteParcours(@PathVariable Long id) {
        log.debug("REST request to delete Parcours : {}", id);
        parcoursRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
