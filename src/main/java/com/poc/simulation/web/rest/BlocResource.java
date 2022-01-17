package com.poc.simulation.web.rest;

import com.poc.simulation.domain.Bloc;
import com.poc.simulation.repository.BlocRepository;
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
 * REST controller for managing {@link com.poc.simulation.domain.Bloc}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlocResource {

    private final Logger log = LoggerFactory.getLogger(BlocResource.class);

    private static final String ENTITY_NAME = "bloc";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlocRepository blocRepository;

    public BlocResource(BlocRepository blocRepository) {
        this.blocRepository = blocRepository;
    }

    /**
     * {@code POST  /blocs} : Create a new bloc.
     *
     * @param bloc the bloc to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloc, or with status {@code 400 (Bad Request)} if the bloc has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/blocs")
    public ResponseEntity<Bloc> createBloc(@Valid @RequestBody Bloc bloc) throws URISyntaxException {
        log.debug("REST request to save Bloc : {}", bloc);
        if (bloc.getId() != null) {
            throw new BadRequestAlertException("A new bloc cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bloc result = blocRepository.save(bloc);
        return ResponseEntity
            .created(new URI("/api/blocs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /blocs/:id} : Updates an existing bloc.
     *
     * @param id the id of the bloc to save.
     * @param bloc the bloc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloc,
     * or with status {@code 400 (Bad Request)} if the bloc is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bloc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/blocs/{id}")
    public ResponseEntity<Bloc> updateBloc(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Bloc bloc)
        throws URISyntaxException {
        log.debug("REST request to update Bloc : {}, {}", id, bloc);
        if (bloc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloc.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bloc result = blocRepository.save(bloc);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bloc.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /blocs/:id} : Partial updates given fields of an existing bloc, field will ignore if it is null
     *
     * @param id the id of the bloc to save.
     * @param bloc the bloc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloc,
     * or with status {@code 400 (Bad Request)} if the bloc is not valid,
     * or with status {@code 404 (Not Found)} if the bloc is not found,
     * or with status {@code 500 (Internal Server Error)} if the bloc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/blocs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bloc> partialUpdateBloc(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Bloc bloc
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bloc partially : {}, {}", id, bloc);
        if (bloc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloc.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blocRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bloc> result = blocRepository
            .findById(bloc.getId())
            .map(existingBloc -> {
                if (bloc.getName() != null) {
                    existingBloc.setName(bloc.getName());
                }
                if (bloc.getLabel() != null) {
                    existingBloc.setLabel(bloc.getLabel());
                }
                if (bloc.getElementName() != null) {
                    existingBloc.setElementName(bloc.getElementName());
                }
                if (bloc.getElementPath() != null) {
                    existingBloc.setElementPath(bloc.getElementPath());
                }
                if (bloc.getEtapeDefinitionId() != null) {
                    existingBloc.setEtapeDefinitionId(bloc.getEtapeDefinitionId());
                }
                if (bloc.getBlocDefinitionId() != null) {
                    existingBloc.setBlocDefinitionId(bloc.getBlocDefinitionId());
                }
                if (bloc.getDisplay() != null) {
                    existingBloc.setDisplay(bloc.getDisplay());
                }

                return existingBloc;
            })
            .map(blocRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bloc.getId().toString())
        );
    }

    /**
     * {@code GET  /blocs} : get all the blocs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blocs in body.
     */
    @GetMapping("/blocs")
    public List<Bloc> getAllBlocs() {
        log.debug("REST request to get all Blocs");
        return blocRepository.findAll();
    }

    /**
     * {@code GET  /blocs/:id} : get the "id" bloc.
     *
     * @param id the id of the bloc to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bloc, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/blocs/{id}")
    public ResponseEntity<Bloc> getBloc(@PathVariable Long id) {
        log.debug("REST request to get Bloc : {}", id);
        Optional<Bloc> bloc = blocRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bloc);
    }

    /**
     * {@code DELETE  /blocs/:id} : delete the "id" bloc.
     *
     * @param id the id of the bloc to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/blocs/{id}")
    public ResponseEntity<Void> deleteBloc(@PathVariable Long id) {
        log.debug("REST request to delete Bloc : {}", id);
        blocRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
