package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.ParcoursDefinition;
import com.poc.simulation.repository.ParcoursDefinitionRepository;
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
 * Integration tests for the {@link ParcoursDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParcoursDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parcours-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParcoursDefinitionRepository parcoursDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParcoursDefinitionMockMvc;

    private ParcoursDefinition parcoursDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParcoursDefinition createEntity(EntityManager em) {
        ParcoursDefinition parcoursDefinition = new ParcoursDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL);
        return parcoursDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParcoursDefinition createUpdatedEntity(EntityManager em) {
        ParcoursDefinition parcoursDefinition = new ParcoursDefinition().name(UPDATED_NAME).label(UPDATED_LABEL);
        return parcoursDefinition;
    }

    @BeforeEach
    public void initTest() {
        parcoursDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createParcoursDefinition() throws Exception {
        int databaseSizeBeforeCreate = parcoursDefinitionRepository.findAll().size();
        // Create the ParcoursDefinition
        restParcoursDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        ParcoursDefinition testParcoursDefinition = parcoursDefinitionList.get(parcoursDefinitionList.size() - 1);
        assertThat(testParcoursDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testParcoursDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createParcoursDefinitionWithExistingId() throws Exception {
        // Create the ParcoursDefinition with an existing ID
        parcoursDefinition.setId(1L);

        int databaseSizeBeforeCreate = parcoursDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParcoursDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursDefinitionRepository.findAll().size();
        // set the field null
        parcoursDefinition.setName(null);

        // Create the ParcoursDefinition, which fails.

        restParcoursDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursDefinitionRepository.findAll().size();
        // set the field null
        parcoursDefinition.setLabel(null);

        // Create the ParcoursDefinition, which fails.

        restParcoursDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllParcoursDefinitions() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        // Get all the parcoursDefinitionList
        restParcoursDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parcoursDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getParcoursDefinition() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        // Get the parcoursDefinition
        restParcoursDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, parcoursDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parcoursDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingParcoursDefinition() throws Exception {
        // Get the parcoursDefinition
        restParcoursDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewParcoursDefinition() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();

        // Update the parcoursDefinition
        ParcoursDefinition updatedParcoursDefinition = parcoursDefinitionRepository.findById(parcoursDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedParcoursDefinition are not directly saved in db
        em.detach(updatedParcoursDefinition);
        updatedParcoursDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restParcoursDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParcoursDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParcoursDefinition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursDefinition testParcoursDefinition = parcoursDefinitionList.get(parcoursDefinitionList.size() - 1);
        assertThat(testParcoursDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParcoursDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parcoursDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParcoursDefinitionWithPatch() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();

        // Update the parcoursDefinition using partial update
        ParcoursDefinition partialUpdatedParcoursDefinition = new ParcoursDefinition();
        partialUpdatedParcoursDefinition.setId(parcoursDefinition.getId());

        restParcoursDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcoursDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcoursDefinition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursDefinition testParcoursDefinition = parcoursDefinitionList.get(parcoursDefinitionList.size() - 1);
        assertThat(testParcoursDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testParcoursDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateParcoursDefinitionWithPatch() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();

        // Update the parcoursDefinition using partial update
        ParcoursDefinition partialUpdatedParcoursDefinition = new ParcoursDefinition();
        partialUpdatedParcoursDefinition.setId(parcoursDefinition.getId());

        partialUpdatedParcoursDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restParcoursDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcoursDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcoursDefinition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursDefinition testParcoursDefinition = parcoursDefinitionList.get(parcoursDefinitionList.size() - 1);
        assertThat(testParcoursDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParcoursDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parcoursDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParcoursDefinition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursDefinitionRepository.findAll().size();
        parcoursDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParcoursDefinition in the database
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParcoursDefinition() throws Exception {
        // Initialize the database
        parcoursDefinitionRepository.saveAndFlush(parcoursDefinition);

        int databaseSizeBeforeDelete = parcoursDefinitionRepository.findAll().size();

        // Delete the parcoursDefinition
        restParcoursDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, parcoursDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParcoursDefinition> parcoursDefinitionList = parcoursDefinitionRepository.findAll();
        assertThat(parcoursDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
