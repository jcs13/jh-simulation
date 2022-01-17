package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.Etape;
import com.poc.simulation.repository.EtapeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EtapeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtapeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_ETAPE_DEFINITION_ID = "AAAAAAAAAA";
    private static final String UPDATED_ETAPE_DEFINITION_ID = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DISPLAY = false;
    private static final Boolean UPDATED_DISPLAY = true;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String ENTITY_API_URL = "/api/etapes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EtapeRepository etapeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtapeMockMvc;

    private Etape etape;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etape createEntity(EntityManager em) {
        Etape etape = new Etape()
            .name(DEFAULT_NAME)
            .label(DEFAULT_LABEL)
            .etapeDefinitionId(DEFAULT_ETAPE_DEFINITION_ID)
            .display(DEFAULT_DISPLAY)
            .order(DEFAULT_ORDER);
        return etape;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etape createUpdatedEntity(EntityManager em) {
        Etape etape = new Etape()
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);
        return etape;
    }

    @BeforeEach
    public void initTest() {
        etape = createEntity(em);
    }

    @Test
    @Transactional
    void createEtape() throws Exception {
        int databaseSizeBeforeCreate = etapeRepository.findAll().size();
        // Create the Etape
        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isCreated());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeCreate + 1);
        Etape testEtape = etapeList.get(etapeList.size() - 1);
        assertThat(testEtape.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEtape.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testEtape.getEtapeDefinitionId()).isEqualTo(DEFAULT_ETAPE_DEFINITION_ID);
        assertThat(testEtape.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
        assertThat(testEtape.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void createEtapeWithExistingId() throws Exception {
        // Create the Etape with an existing ID
        etape.setId(1L);

        int databaseSizeBeforeCreate = etapeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeRepository.findAll().size();
        // set the field null
        etape.setName(null);

        // Create the Etape, which fails.

        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeRepository.findAll().size();
        // set the field null
        etape.setLabel(null);

        // Create the Etape, which fails.

        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtapeDefinitionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeRepository.findAll().size();
        // set the field null
        etape.setEtapeDefinitionId(null);

        // Create the Etape, which fails.

        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDisplayIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeRepository.findAll().size();
        // set the field null
        etape.setDisplay(null);

        // Create the Etape, which fails.

        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeRepository.findAll().size();
        // set the field null
        etape.setOrder(null);

        // Create the Etape, which fails.

        restEtapeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isBadRequest());

        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEtapes() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        // Get all the etapeList
        restEtapeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etape.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].etapeDefinitionId").value(hasItem(DEFAULT_ETAPE_DEFINITION_ID)))
            .andExpect(jsonPath("$.[*].display").value(hasItem(DEFAULT_DISPLAY.booleanValue())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)));
    }

    @Test
    @Transactional
    void getEtape() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        // Get the etape
        restEtapeMockMvc
            .perform(get(ENTITY_API_URL_ID, etape.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etape.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.etapeDefinitionId").value(DEFAULT_ETAPE_DEFINITION_ID))
            .andExpect(jsonPath("$.display").value(DEFAULT_DISPLAY.booleanValue()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER));
    }

    @Test
    @Transactional
    void getNonExistingEtape() throws Exception {
        // Get the etape
        restEtapeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEtape() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();

        // Update the etape
        Etape updatedEtape = etapeRepository.findById(etape.getId()).get();
        // Disconnect from session so that the updates on updatedEtape are not directly saved in db
        em.detach(updatedEtape);
        updatedEtape
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);

        restEtapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtape.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEtape))
            )
            .andExpect(status().isOk());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
        Etape testEtape = etapeList.get(etapeList.size() - 1);
        assertThat(testEtape.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEtape.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testEtape.getEtapeDefinitionId()).isEqualTo(UPDATED_ETAPE_DEFINITION_ID);
        assertThat(testEtape.getDisplay()).isEqualTo(UPDATED_DISPLAY);
        assertThat(testEtape.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etape.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtapeWithPatch() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();

        // Update the etape using partial update
        Etape partialUpdatedEtape = new Etape();
        partialUpdatedEtape.setId(etape.getId());

        partialUpdatedEtape.etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID);

        restEtapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtape.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtape))
            )
            .andExpect(status().isOk());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
        Etape testEtape = etapeList.get(etapeList.size() - 1);
        assertThat(testEtape.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEtape.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testEtape.getEtapeDefinitionId()).isEqualTo(UPDATED_ETAPE_DEFINITION_ID);
        assertThat(testEtape.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
        assertThat(testEtape.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateEtapeWithPatch() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();

        // Update the etape using partial update
        Etape partialUpdatedEtape = new Etape();
        partialUpdatedEtape.setId(etape.getId());

        partialUpdatedEtape
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);

        restEtapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtape.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtape))
            )
            .andExpect(status().isOk());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
        Etape testEtape = etapeList.get(etapeList.size() - 1);
        assertThat(testEtape.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEtape.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testEtape.getEtapeDefinitionId()).isEqualTo(UPDATED_ETAPE_DEFINITION_ID);
        assertThat(testEtape.getDisplay()).isEqualTo(UPDATED_DISPLAY);
        assertThat(testEtape.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etape.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtape() throws Exception {
        int databaseSizeBeforeUpdate = etapeRepository.findAll().size();
        etape.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(etape)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etape in the database
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtape() throws Exception {
        // Initialize the database
        etapeRepository.saveAndFlush(etape);

        int databaseSizeBeforeDelete = etapeRepository.findAll().size();

        // Delete the etape
        restEtapeMockMvc
            .perform(delete(ENTITY_API_URL_ID, etape.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Etape> etapeList = etapeRepository.findAll();
        assertThat(etapeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
