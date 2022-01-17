package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.EtapeDefinition;
import com.poc.simulation.repository.EtapeDefinitionRepository;
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
 * Integration tests for the {@link EtapeDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtapeDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/etape-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EtapeDefinitionRepository etapeDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtapeDefinitionMockMvc;

    private EtapeDefinition etapeDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeDefinition createEntity(EntityManager em) {
        EtapeDefinition etapeDefinition = new EtapeDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL);
        return etapeDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeDefinition createUpdatedEntity(EntityManager em) {
        EtapeDefinition etapeDefinition = new EtapeDefinition().name(UPDATED_NAME).label(UPDATED_LABEL);
        return etapeDefinition;
    }

    @BeforeEach
    public void initTest() {
        etapeDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createEtapeDefinition() throws Exception {
        int databaseSizeBeforeCreate = etapeDefinitionRepository.findAll().size();
        // Create the EtapeDefinition
        restEtapeDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        EtapeDefinition testEtapeDefinition = etapeDefinitionList.get(etapeDefinitionList.size() - 1);
        assertThat(testEtapeDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEtapeDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createEtapeDefinitionWithExistingId() throws Exception {
        // Create the EtapeDefinition with an existing ID
        etapeDefinition.setId(1L);

        int databaseSizeBeforeCreate = etapeDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtapeDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeDefinitionRepository.findAll().size();
        // set the field null
        etapeDefinition.setName(null);

        // Create the EtapeDefinition, which fails.

        restEtapeDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeDefinitionRepository.findAll().size();
        // set the field null
        etapeDefinition.setLabel(null);

        // Create the EtapeDefinition, which fails.

        restEtapeDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEtapeDefinitions() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        // Get all the etapeDefinitionList
        restEtapeDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etapeDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getEtapeDefinition() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        // Get the etapeDefinition
        restEtapeDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, etapeDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etapeDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingEtapeDefinition() throws Exception {
        // Get the etapeDefinition
        restEtapeDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEtapeDefinition() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();

        // Update the etapeDefinition
        EtapeDefinition updatedEtapeDefinition = etapeDefinitionRepository.findById(etapeDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedEtapeDefinition are not directly saved in db
        em.detach(updatedEtapeDefinition);
        updatedEtapeDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restEtapeDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtapeDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEtapeDefinition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeDefinition testEtapeDefinition = etapeDefinitionList.get(etapeDefinitionList.size() - 1);
        assertThat(testEtapeDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEtapeDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etapeDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtapeDefinitionWithPatch() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();

        // Update the etapeDefinition using partial update
        EtapeDefinition partialUpdatedEtapeDefinition = new EtapeDefinition();
        partialUpdatedEtapeDefinition.setId(etapeDefinition.getId());

        restEtapeDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeDefinition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeDefinition testEtapeDefinition = etapeDefinitionList.get(etapeDefinitionList.size() - 1);
        assertThat(testEtapeDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEtapeDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateEtapeDefinitionWithPatch() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();

        // Update the etapeDefinition using partial update
        EtapeDefinition partialUpdatedEtapeDefinition = new EtapeDefinition();
        partialUpdatedEtapeDefinition.setId(etapeDefinition.getId());

        partialUpdatedEtapeDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restEtapeDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeDefinition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeDefinition testEtapeDefinition = etapeDefinitionList.get(etapeDefinitionList.size() - 1);
        assertThat(testEtapeDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEtapeDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etapeDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtapeDefinition() throws Exception {
        int databaseSizeBeforeUpdate = etapeDefinitionRepository.findAll().size();
        etapeDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeDefinition in the database
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtapeDefinition() throws Exception {
        // Initialize the database
        etapeDefinitionRepository.saveAndFlush(etapeDefinition);

        int databaseSizeBeforeDelete = etapeDefinitionRepository.findAll().size();

        // Delete the etapeDefinition
        restEtapeDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, etapeDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EtapeDefinition> etapeDefinitionList = etapeDefinitionRepository.findAll();
        assertThat(etapeDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
