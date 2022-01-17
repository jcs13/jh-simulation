package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.BlocTransition;
import com.poc.simulation.repository.BlocTransitionRepository;
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
 * Integration tests for the {@link BlocTransitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlocTransitionResourceIT {

    private static final Integer DEFAULT_TRANSITION = 1;
    private static final Integer UPDATED_TRANSITION = 2;

    private static final String ENTITY_API_URL = "/api/bloc-transitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlocTransitionRepository blocTransitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlocTransitionMockMvc;

    private BlocTransition blocTransition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocTransition createEntity(EntityManager em) {
        BlocTransition blocTransition = new BlocTransition().transition(DEFAULT_TRANSITION);
        return blocTransition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlocTransition createUpdatedEntity(EntityManager em) {
        BlocTransition blocTransition = new BlocTransition().transition(UPDATED_TRANSITION);
        return blocTransition;
    }

    @BeforeEach
    public void initTest() {
        blocTransition = createEntity(em);
    }

    @Test
    @Transactional
    void createBlocTransition() throws Exception {
        int databaseSizeBeforeCreate = blocTransitionRepository.findAll().size();
        // Create the BlocTransition
        restBlocTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isCreated());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeCreate + 1);
        BlocTransition testBlocTransition = blocTransitionList.get(blocTransitionList.size() - 1);
        assertThat(testBlocTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void createBlocTransitionWithExistingId() throws Exception {
        // Create the BlocTransition with an existing ID
        blocTransition.setId(1L);

        int databaseSizeBeforeCreate = blocTransitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlocTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTransitionIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocTransitionRepository.findAll().size();
        // set the field null
        blocTransition.setTransition(null);

        // Create the BlocTransition, which fails.

        restBlocTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlocTransitions() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        // Get all the blocTransitionList
        restBlocTransitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blocTransition.getId().intValue())))
            .andExpect(jsonPath("$.[*].transition").value(hasItem(DEFAULT_TRANSITION)));
    }

    @Test
    @Transactional
    void getBlocTransition() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        // Get the blocTransition
        restBlocTransitionMockMvc
            .perform(get(ENTITY_API_URL_ID, blocTransition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blocTransition.getId().intValue()))
            .andExpect(jsonPath("$.transition").value(DEFAULT_TRANSITION));
    }

    @Test
    @Transactional
    void getNonExistingBlocTransition() throws Exception {
        // Get the blocTransition
        restBlocTransitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlocTransition() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();

        // Update the blocTransition
        BlocTransition updatedBlocTransition = blocTransitionRepository.findById(blocTransition.getId()).get();
        // Disconnect from session so that the updates on updatedBlocTransition are not directly saved in db
        em.detach(updatedBlocTransition);
        updatedBlocTransition.transition(UPDATED_TRANSITION);

        restBlocTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlocTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlocTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlocTransition testBlocTransition = blocTransitionList.get(blocTransitionList.size() - 1);
        assertThat(testBlocTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void putNonExistingBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blocTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blocTransition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlocTransitionWithPatch() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();

        // Update the blocTransition using partial update
        BlocTransition partialUpdatedBlocTransition = new BlocTransition();
        partialUpdatedBlocTransition.setId(blocTransition.getId());

        partialUpdatedBlocTransition.transition(UPDATED_TRANSITION);

        restBlocTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlocTransition testBlocTransition = blocTransitionList.get(blocTransitionList.size() - 1);
        assertThat(testBlocTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void fullUpdateBlocTransitionWithPatch() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();

        // Update the blocTransition using partial update
        BlocTransition partialUpdatedBlocTransition = new BlocTransition();
        partialUpdatedBlocTransition.setId(blocTransition.getId());

        partialUpdatedBlocTransition.transition(UPDATED_TRANSITION);

        restBlocTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlocTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlocTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlocTransition testBlocTransition = blocTransitionList.get(blocTransitionList.size() - 1);
        assertThat(testBlocTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void patchNonExistingBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blocTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlocTransition() throws Exception {
        int databaseSizeBeforeUpdate = blocTransitionRepository.findAll().size();
        blocTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blocTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlocTransition in the database
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlocTransition() throws Exception {
        // Initialize the database
        blocTransitionRepository.saveAndFlush(blocTransition);

        int databaseSizeBeforeDelete = blocTransitionRepository.findAll().size();

        // Delete the blocTransition
        restBlocTransitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, blocTransition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlocTransition> blocTransitionList = blocTransitionRepository.findAll();
        assertThat(blocTransitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
