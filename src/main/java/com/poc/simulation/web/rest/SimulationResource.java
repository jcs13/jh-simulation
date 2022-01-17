package com.poc.simulation.web.rest;

import com.poc.simulation.domain.Simulation;
import com.poc.simulation.repository.SimulationRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.Simulation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SimulationResource {

    private final Logger log = LoggerFactory.getLogger(SimulationResource.class);

    private static final String ENTITY_NAME = "simulation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SimulationRepository simulationRepository;

    public SimulationResource(SimulationRepository simulationRepository) {
        this.simulationRepository = simulationRepository;
    }

    /**
     * {@code POST  /simulations} : Create a new simulation.
     *
     * @param simulation the simulation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new simulation, or with status {@code 400 (Bad Request)} if the simulation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/simulations")
    public ResponseEntity<Simulation> createSimulation(@Valid @RequestBody Simulation simulation) throws URISyntaxException {
        log.debug("REST request to save Simulation : {}", simulation);
        if (simulation.getId() != null) {
            throw new BadRequestAlertException("A new simulation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Simulation result = simulationRepository.save(simulation);
        return ResponseEntity
            .created(new URI("/api/simulations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /simulations/:id} : Updates an existing simulation.
     *
     * @param id the id of the simulation to save.
     * @param simulation the simulation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulation,
     * or with status {@code 400 (Bad Request)} if the simulation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the simulation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/simulations/{id}")
    public ResponseEntity<Simulation> updateSimulation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Simulation simulation
    ) throws URISyntaxException {
        log.debug("REST request to update Simulation : {}, {}", id, simulation);
        if (simulation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!simulationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Simulation result = simulationRepository.save(simulation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, simulation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /simulations/:id} : Partial updates given fields of an existing simulation, field will ignore if it is null
     *
     * @param id the id of the simulation to save.
     * @param simulation the simulation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulation,
     * or with status {@code 400 (Bad Request)} if the simulation is not valid,
     * or with status {@code 404 (Not Found)} if the simulation is not found,
     * or with status {@code 500 (Internal Server Error)} if the simulation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/simulations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Simulation> partialUpdateSimulation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Simulation simulation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Simulation partially : {}, {}", id, simulation);
        if (simulation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!simulationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Simulation> result = simulationRepository
            .findById(simulation.getId())
            .map(existingSimulation -> {
                if (simulation.getName() != null) {
                    existingSimulation.setName(simulation.getName());
                }
                if (simulation.getAffaire() != null) {
                    existingSimulation.setAffaire(simulation.getAffaire());
                }
                if (simulation.getClient() != null) {
                    existingSimulation.setClient(simulation.getClient());
                }
                if (simulation.getParc() != null) {
                    existingSimulation.setParc(simulation.getParc());
                }
                if (simulation.getAdresseInstallation() != null) {
                    existingSimulation.setAdresseInstallation(simulation.getAdresseInstallation());
                }
                if (simulation.getStatus() != null) {
                    existingSimulation.setStatus(simulation.getStatus());
                }
                if (simulation.getCreated() != null) {
                    existingSimulation.setCreated(simulation.getCreated());
                }
                if (simulation.getModifier() != null) {
                    existingSimulation.setModifier(simulation.getModifier());
                }

                return existingSimulation;
            })
            .map(simulationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, simulation.getId().toString())
        );
    }

    /**
     * {@code GET  /simulations} : get all the simulations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of simulations in body.
     */
    @GetMapping("/simulations")
    public List<Simulation> getAllSimulations() {
        log.debug("REST request to get all Simulations");
        return simulationRepository.findAll();
    }

    /**
     * {@code GET  /simulations/:id} : get the "id" simulation.
     *
     * @param id the id of the simulation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the simulation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/simulations/{id}")
    public ResponseEntity<Simulation> getSimulation(@PathVariable Long id) {
        log.debug("REST request to get Simulation : {}", id);
        Optional<Simulation> simulation = simulationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(simulation);
    }

    /**
     * {@code DELETE  /simulations/:id} : delete the "id" simulation.
     *
     * @param id the id of the simulation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/simulations/{id}")
    public ResponseEntity<Void> deleteSimulation(@PathVariable Long id) {
        log.debug("REST request to delete Simulation : {}", id);
        simulationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
