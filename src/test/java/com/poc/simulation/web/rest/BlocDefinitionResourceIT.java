package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.BlocDefinition;
import com.poc.simulation.repository.BlocDefinitionRepository;
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
 * Integration tests for the {@link BlocDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlocDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bloc-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlocDefinitionRepository blocDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlocDefinitionMockMvc;

    private BlocDefinition blocDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocDefinition createEntity(EntityManager em) {
        BlocDefinition blocDefinition = new BlocDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL);
        return blocDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocDefinition createUpdatedEntity(EntityManager em) {
        BlocDefinition blocDefinition = new BlocDefinition().name(UPDATED_NAME).label(UPDATED_LABEL);
        return blocDefinition;
    }

    @BeforeEach
    public void initTest() {
        blocDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createBlocDefinition() throws Exception {
        int databaseSizeBeforeCreate = blocDefinitionRepository.findAll().size();
        // Create the BlocDefinition
        restBlocDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        BlocDefinition testBlocDefinition = blocDefinitionList.get(blocDefinitionList.size() - 1);
        assertThat(testBlocDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBlocDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createBlocDefinitionWithExistingId() throws Exception {
        // Create the BlocDefinition with an existing ID
        blocDefinition.setId(1L);

        int databaseSizeBeforeCreate = blocDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlocDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocDefinitionRepository.findAll().size();
        // set the field null
        blocDefinition.setName(null);

        // Create the BlocDefinition, which fails.

        restBlocDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocDefinitionRepository.findAll().size();
        // set the field null
        blocDefinition.setLabel(null);

        // Create the BlocDefinition, which fails.

        restBlocDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlocDefinitions() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        // Get all the blocDefinitionList
        restBlocDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blocDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getBlocDefinition() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        // Get the blocDefinition
        restBlocDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, blocDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blocDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingBlocDefinition() throws Exception {
        // Get the blocDefinition
        restBlocDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlocDefinition() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();

        // Update the blocDefinition
        BlocDefinition updatedBlocDefinition = blocDefinitionRepository.findById(blocDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedBlocDefinition are not directly saved in db
        em.detach(updatedBlocDefinition);
        updatedBlocDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restBlocDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlocDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlocDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlocDefinition testBlocDefinition = blocDefinitionList.get(blocDefinitionList.size() - 1);
        assertThat(testBlocDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBlocDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blocDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocDefinition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlocDefinitionWithPatch() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();

        // Update the blocDefinition using partial update
        BlocDefinition partialUpdatedBlocDefinition = new BlocDefinition();
        partialUpdatedBlocDefinition.setId(blocDefinition.getId());

        restBlocDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlocDefinition testBlocDefinition = blocDefinitionList.get(blocDefinitionList.size() - 1);
        assertThat(testBlocDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBlocDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateBlocDefinitionWithPatch() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();

        // Update the blocDefinition using partial update
        BlocDefinition partialUpdatedBlocDefinition = new BlocDefinition();
        partialUpdatedBlocDefinition.setId(blocDefinition.getId());

        partialUpdatedBlocDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restBlocDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlocDefinition testBlocDefinition = blocDefinitionList.get(blocDefinitionList.size() - 1);
        assertThat(testBlocDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBlocDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blocDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlocDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blocDefinitionRepository.findAll().size();
        blocDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blocDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocDefinition in the database
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlocDefinition() throws Exception {
        // Initialize the database
        blocDefinitionRepository.saveAndFlush(blocDefinition);

        int databaseSizeBeforeDelete = blocDefinitionRepository.findAll().size();

        // Delete the blocDefinition
        restBlocDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, blocDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlocDefinition> blocDefinitionList = blocDefinitionRepository.findAll();
        assertThat(blocDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
