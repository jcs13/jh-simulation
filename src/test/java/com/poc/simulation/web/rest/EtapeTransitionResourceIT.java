package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.EtapeTransition;
import com.poc.simulation.repository.EtapeTransitionRepository;
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
 * Integration tests for the {@link EtapeTransitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtapeTransitionResourceIT {

    private static final Integer DEFAULT_TRANSITION = 1;
    private static final Integer UPDATED_TRANSITION = 2;

    private static final String ENTITY_API_URL = "/api/etape-transitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EtapeTransitionRepository etapeTransitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtapeTransitionMockMvc;

    private EtapeTransition etapeTransition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeTransition createEntity(EntityManager em) {
        EtapeTransition etapeTransition = new EtapeTransition().transition(DEFAULT_TRANSITION);
        return etapeTransition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EtapeTransition createUpdatedEntity(EntityManager em) {
        EtapeTransition etapeTransition = new EtapeTransition().transition(UPDATED_TRANSITION);
        return etapeTransition;
    }

    @BeforeEach
    public void initTest() {
        etapeTransition = createEntity(em);
    }

    @Test
    @Transactional
    void createEtapeTransition() throws Exception {
        int databaseSizeBeforeCreate = etapeTransitionRepository.findAll().size();
        // Create the EtapeTransition
        restEtapeTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isCreated());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeCreate + 1);
        EtapeTransition testEtapeTransition = etapeTransitionList.get(etapeTransitionList.size() - 1);
        assertThat(testEtapeTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void createEtapeTransitionWithExistingId() throws Exception {
        // Create the EtapeTransition with an existing ID
        etapeTransition.setId(1L);

        int databaseSizeBeforeCreate = etapeTransitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtapeTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTransitionIsRequired() throws Exception {
        int databaseSizeBeforeTest = etapeTransitionRepository.findAll().size();
        // set the field null
        etapeTransition.setTransition(null);

        // Create the EtapeTransition, which fails.

        restEtapeTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEtapeTransitions() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        // Get all the etapeTransitionList
        restEtapeTransitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etapeTransition.getId().intValue())))
            .andExpect(jsonPath("$.[*].transition").value(hasItem(DEFAULT_TRANSITION)));
    }

    @Test
    @Transactional
    void getEtapeTransition() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        // Get the etapeTransition
        restEtapeTransitionMockMvc
            .perform(get(ENTITY_API_URL_ID, etapeTransition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etapeTransition.getId().intValue()))
            .andExpect(jsonPath("$.transition").value(DEFAULT_TRANSITION));
    }

    @Test
    @Transactional
    void getNonExistingEtapeTransition() throws Exception {
        // Get the etapeTransition
        restEtapeTransitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEtapeTransition() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();

        // Update the etapeTransition
        EtapeTransition updatedEtapeTransition = etapeTransitionRepository.findById(etapeTransition.getId()).get();
        // Disconnect from session so that the updates on updatedEtapeTransition are not directly saved in db
        em.detach(updatedEtapeTransition);
        updatedEtapeTransition.transition(UPDATED_TRANSITION);

        restEtapeTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtapeTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEtapeTransition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeTransition testEtapeTransition = etapeTransitionList.get(etapeTransitionList.size() - 1);
        assertThat(testEtapeTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void putNonExistingEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etapeTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtapeTransitionWithPatch() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();

        // Update the etapeTransition using partial update
        EtapeTransition partialUpdatedEtapeTransition = new EtapeTransition();
        partialUpdatedEtapeTransition.setId(etapeTransition.getId());

        restEtapeTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeTransition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeTransition testEtapeTransition = etapeTransitionList.get(etapeTransitionList.size() - 1);
        assertThat(testEtapeTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void fullUpdateEtapeTransitionWithPatch() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();

        // Update the etapeTransition using partial update
        EtapeTransition partialUpdatedEtapeTransition = new EtapeTransition();
        partialUpdatedEtapeTransition.setId(etapeTransition.getId());

        partialUpdatedEtapeTransition.transition(UPDATED_TRANSITION);

        restEtapeTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtapeTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEtapeTransition))
            )
            .andExpect(status().isOk());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
        EtapeTransition testEtapeTransition = etapeTransitionList.get(etapeTransitionList.size() - 1);
        assertThat(testEtapeTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void patchNonExistingEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etapeTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtapeTransition() throws Exception {
        int databaseSizeBeforeUpdate = etapeTransitionRepository.findAll().size();
        etapeTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtapeTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(etapeTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EtapeTransition in the database
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtapeTransition() throws Exception {
        // Initialize the database
        etapeTransitionRepository.saveAndFlush(etapeTransition);

        int databaseSizeBeforeDelete = etapeTransitionRepository.findAll().size();

        // Delete the etapeTransition
        restEtapeTransitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, etapeTransition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EtapeTransition> etapeTransitionList = etapeTransitionRepository.findAll();
        assertThat(etapeTransitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
