package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.ParcoursComposition;
import com.poc.simulation.repository.ParcoursCompositionRepository;
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
 * Integration tests for the {@link ParcoursCompositionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParcoursCompositionResourceIT {

    private static final Integer DEFAULT_INHERITANCE_ORDER = 1;
    private static final Integer UPDATED_INHERITANCE_ORDER = 2;

    private static final String ENTITY_API_URL = "/api/parcours-compositions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParcoursCompositionRepository parcoursCompositionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParcoursCompositionMockMvc;

    private ParcoursComposition parcoursComposition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParcoursComposition createEntity(EntityManager em) {
        ParcoursComposition parcoursComposition = new ParcoursComposition().inheritanceOrder(DEFAULT_INHERITANCE_ORDER);
        return parcoursComposition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParcoursComposition createUpdatedEntity(EntityManager em) {
        ParcoursComposition parcoursComposition = new ParcoursComposition().inheritanceOrder(UPDATED_INHERITANCE_ORDER);
        return parcoursComposition;
    }

    @BeforeEach
    public void initTest() {
        parcoursComposition = createEntity(em);
    }

    @Test
    @Transactional
    void createParcoursComposition() throws Exception {
        int databaseSizeBeforeCreate = parcoursCompositionRepository.findAll().size();
        // Create the ParcoursComposition
        restParcoursCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isCreated());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeCreate + 1);
        ParcoursComposition testParcoursComposition = parcoursCompositionList.get(parcoursCompositionList.size() - 1);
        assertThat(testParcoursComposition.getInheritanceOrder()).isEqualTo(DEFAULT_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void createParcoursCompositionWithExistingId() throws Exception {
        // Create the ParcoursComposition with an existing ID
        parcoursComposition.setId(1L);

        int databaseSizeBeforeCreate = parcoursCompositionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParcoursCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInheritanceOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursCompositionRepository.findAll().size();
        // set the field null
        parcoursComposition.setInheritanceOrder(null);

        // Create the ParcoursComposition, which fails.

        restParcoursCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllParcoursCompositions() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        // Get all the parcoursCompositionList
        restParcoursCompositionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parcoursComposition.getId().intValue())))
            .andExpect(jsonPath("$.[*].inheritanceOrder").value(hasItem(DEFAULT_INHERITANCE_ORDER)));
    }

    @Test
    @Transactional
    void getParcoursComposition() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        // Get the parcoursComposition
        restParcoursCompositionMockMvc
            .perform(get(ENTITY_API_URL_ID, parcoursComposition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parcoursComposition.getId().intValue()))
            .andExpect(jsonPath("$.inheritanceOrder").value(DEFAULT_INHERITANCE_ORDER));
    }

    @Test
    @Transactional
    void getNonExistingParcoursComposition() throws Exception {
        // Get the parcoursComposition
        restParcoursCompositionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewParcoursComposition() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();

        // Update the parcoursComposition
        ParcoursComposition updatedParcoursComposition = parcoursCompositionRepository.findById(parcoursComposition.getId()).get();
        // Disconnect from session so that the updates on updatedParcoursComposition are not directly saved in db
        em.detach(updatedParcoursComposition);
        updatedParcoursComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParcoursComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursComposition testParcoursComposition = parcoursCompositionList.get(parcoursCompositionList.size() - 1);
        assertThat(testParcoursComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parcoursComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParcoursCompositionWithPatch() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();

        // Update the parcoursComposition using partial update
        ParcoursComposition partialUpdatedParcoursComposition = new ParcoursComposition();
        partialUpdatedParcoursComposition.setId(parcoursComposition.getId());

        restParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursComposition testParcoursComposition = parcoursCompositionList.get(parcoursCompositionList.size() - 1);
        assertThat(testParcoursComposition.getInheritanceOrder()).isEqualTo(DEFAULT_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateParcoursCompositionWithPatch() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();

        // Update the parcoursComposition using partial update
        ParcoursComposition partialUpdatedParcoursComposition = new ParcoursComposition();
        partialUpdatedParcoursComposition.setId(parcoursComposition.getId());

        partialUpdatedParcoursComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcoursComposition))
            )
            .andExpect(status().isOk());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
        ParcoursComposition testParcoursComposition = parcoursCompositionList.get(parcoursCompositionList.size() - 1);
        assertThat(testParcoursComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parcoursComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParcoursComposition() throws Exception {
        int databaseSizeBeforeUpdate = parcoursCompositionRepository.findAll().size();
        parcoursComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcoursComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParcoursComposition in the database
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParcoursComposition() throws Exception {
        // Initialize the database
        parcoursCompositionRepository.saveAndFlush(parcoursComposition);

        int databaseSizeBeforeDelete = parcoursCompositionRepository.findAll().size();

        // Delete the parcoursComposition
        restParcoursCompositionMockMvc
            .perform(delete(ENTITY_API_URL_ID, parcoursComposition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParcoursComposition> parcoursCompositionList = parcoursCompositionRepository.findAll();
        assertThat(parcoursCompositionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
