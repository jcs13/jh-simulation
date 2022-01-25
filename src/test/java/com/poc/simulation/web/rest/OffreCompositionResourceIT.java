package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.OffreComposition;
import com.poc.simulation.repository.OffreCompositionRepository;
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
 * Integration tests for the {@link OffreCompositionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OffreCompositionResourceIT {

    private static final Integer DEFAULT_INHERITANCE_ORDER = 1;
    private static final Integer UPDATED_INHERITANCE_ORDER = 2;

    private static final String ENTITY_API_URL = "/api/offre-compositions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OffreCompositionRepository offreCompositionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffreCompositionMockMvc;

    private OffreComposition offreComposition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreComposition createEntity(EntityManager em) {
        OffreComposition offreComposition = new OffreComposition().inheritanceOrder(DEFAULT_INHERITANCE_ORDER);
        return offreComposition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreComposition createUpdatedEntity(EntityManager em) {
        OffreComposition offreComposition = new OffreComposition().inheritanceOrder(UPDATED_INHERITANCE_ORDER);
        return offreComposition;
    }

    @BeforeEach
    public void initTest() {
        offreComposition = createEntity(em);
    }

    @Test
    @Transactional
    void createOffreComposition() throws Exception {
        int databaseSizeBeforeCreate = offreCompositionRepository.findAll().size();
        // Create the OffreComposition
        restOffreCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isCreated());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeCreate + 1);
        OffreComposition testOffreComposition = offreCompositionList.get(offreCompositionList.size() - 1);
        assertThat(testOffreComposition.getInheritanceOrder()).isEqualTo(DEFAULT_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void createOffreCompositionWithExistingId() throws Exception {
        // Create the OffreComposition with an existing ID
        offreComposition.setId(1L);

        int databaseSizeBeforeCreate = offreCompositionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffreCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInheritanceOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = offreCompositionRepository.findAll().size();
        // set the field null
        offreComposition.setInheritanceOrder(null);

        // Create the OffreComposition, which fails.

        restOffreCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOffreCompositions() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        // Get all the offreCompositionList
        restOffreCompositionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offreComposition.getId().intValue())))
            .andExpect(jsonPath("$.[*].inheritanceOrder").value(hasItem(DEFAULT_INHERITANCE_ORDER)));
    }

    @Test
    @Transactional
    void getOffreComposition() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        // Get the offreComposition
        restOffreCompositionMockMvc
            .perform(get(ENTITY_API_URL_ID, offreComposition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offreComposition.getId().intValue()))
            .andExpect(jsonPath("$.inheritanceOrder").value(DEFAULT_INHERITANCE_ORDER));
    }

    @Test
    @Transactional
    void getNonExistingOffreComposition() throws Exception {
        // Get the offreComposition
        restOffreCompositionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOffreComposition() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();

        // Update the offreComposition
        OffreComposition updatedOffreComposition = offreCompositionRepository.findById(offreComposition.getId()).get();
        // Disconnect from session so that the updates on updatedOffreComposition are not directly saved in db
        em.detach(updatedOffreComposition);
        updatedOffreComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOffreCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffreComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffreComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreComposition testOffreComposition = offreCompositionList.get(offreCompositionList.size() - 1);
        assertThat(testOffreComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offreComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffreCompositionWithPatch() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();

        // Update the offreComposition using partial update
        OffreComposition partialUpdatedOffreComposition = new OffreComposition();
        partialUpdatedOffreComposition.setId(offreComposition.getId());

        partialUpdatedOffreComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOffreCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreComposition testOffreComposition = offreCompositionList.get(offreCompositionList.size() - 1);
        assertThat(testOffreComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateOffreCompositionWithPatch() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();

        // Update the offreComposition using partial update
        OffreComposition partialUpdatedOffreComposition = new OffreComposition();
        partialUpdatedOffreComposition.setId(offreComposition.getId());

        partialUpdatedOffreComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOffreCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreComposition))
            )
            .andExpect(status().isOk());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
        OffreComposition testOffreComposition = offreCompositionList.get(offreCompositionList.size() - 1);
        assertThat(testOffreComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offreComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffreComposition() throws Exception {
        int databaseSizeBeforeUpdate = offreCompositionRepository.findAll().size();
        offreComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreComposition in the database
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffreComposition() throws Exception {
        // Initialize the database
        offreCompositionRepository.saveAndFlush(offreComposition);

        int databaseSizeBeforeDelete = offreCompositionRepository.findAll().size();

        // Delete the offreComposition
        restOffreCompositionMockMvc
            .perform(delete(ENTITY_API_URL_ID, offreComposition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OffreComposition> offreCompositionList = offreCompositionRepository.findAll();
        assertThat(offreCompositionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
