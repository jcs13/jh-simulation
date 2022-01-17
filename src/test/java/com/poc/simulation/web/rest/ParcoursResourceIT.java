package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.Parcours;
import com.poc.simulation.repository.ParcoursRepository;
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
 * Integration tests for the {@link ParcoursResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParcoursResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_OFFRE_ID = "AAAAAAAAAA";
    private static final String UPDATED_OFFRE_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parcours";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParcoursRepository parcoursRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParcoursMockMvc;

    private Parcours parcours;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parcours createEntity(EntityManager em) {
        Parcours parcours = new Parcours().name(DEFAULT_NAME).label(DEFAULT_LABEL).offreId(DEFAULT_OFFRE_ID);
        return parcours;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parcours createUpdatedEntity(EntityManager em) {
        Parcours parcours = new Parcours().name(UPDATED_NAME).label(UPDATED_LABEL).offreId(UPDATED_OFFRE_ID);
        return parcours;
    }

    @BeforeEach
    public void initTest() {
        parcours = createEntity(em);
    }

    @Test
    @Transactional
    void createParcours() throws Exception {
        int databaseSizeBeforeCreate = parcoursRepository.findAll().size();
        // Create the Parcours
        restParcoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isCreated());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeCreate + 1);
        Parcours testParcours = parcoursList.get(parcoursList.size() - 1);
        assertThat(testParcours.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testParcours.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testParcours.getOffreId()).isEqualTo(DEFAULT_OFFRE_ID);
    }

    @Test
    @Transactional
    void createParcoursWithExistingId() throws Exception {
        // Create the Parcours with an existing ID
        parcours.setId(1L);

        int databaseSizeBeforeCreate = parcoursRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParcoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isBadRequest());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursRepository.findAll().size();
        // set the field null
        parcours.setName(null);

        // Create the Parcours, which fails.

        restParcoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isBadRequest());

        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursRepository.findAll().size();
        // set the field null
        parcours.setLabel(null);

        // Create the Parcours, which fails.

        restParcoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isBadRequest());

        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOffreIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = parcoursRepository.findAll().size();
        // set the field null
        parcours.setOffreId(null);

        // Create the Parcours, which fails.

        restParcoursMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isBadRequest());

        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllParcours() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        // Get all the parcoursList
        restParcoursMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parcours.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].offreId").value(hasItem(DEFAULT_OFFRE_ID)));
    }

    @Test
    @Transactional
    void getParcours() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        // Get the parcours
        restParcoursMockMvc
            .perform(get(ENTITY_API_URL_ID, parcours.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parcours.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.offreId").value(DEFAULT_OFFRE_ID));
    }

    @Test
    @Transactional
    void getNonExistingParcours() throws Exception {
        // Get the parcours
        restParcoursMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewParcours() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();

        // Update the parcours
        Parcours updatedParcours = parcoursRepository.findById(parcours.getId()).get();
        // Disconnect from session so that the updates on updatedParcours are not directly saved in db
        em.detach(updatedParcours);
        updatedParcours.name(UPDATED_NAME).label(UPDATED_LABEL).offreId(UPDATED_OFFRE_ID);

        restParcoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParcours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParcours))
            )
            .andExpect(status().isOk());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
        Parcours testParcours = parcoursList.get(parcoursList.size() - 1);
        assertThat(testParcours.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParcours.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testParcours.getOffreId()).isEqualTo(UPDATED_OFFRE_ID);
    }

    @Test
    @Transactional
    void putNonExistingParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parcours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parcours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParcoursWithPatch() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();

        // Update the parcours using partial update
        Parcours partialUpdatedParcours = new Parcours();
        partialUpdatedParcours.setId(parcours.getId());

        partialUpdatedParcours.name(UPDATED_NAME).label(UPDATED_LABEL).offreId(UPDATED_OFFRE_ID);

        restParcoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcours))
            )
            .andExpect(status().isOk());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
        Parcours testParcours = parcoursList.get(parcoursList.size() - 1);
        assertThat(testParcours.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParcours.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testParcours.getOffreId()).isEqualTo(UPDATED_OFFRE_ID);
    }

    @Test
    @Transactional
    void fullUpdateParcoursWithPatch() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();

        // Update the parcours using partial update
        Parcours partialUpdatedParcours = new Parcours();
        partialUpdatedParcours.setId(parcours.getId());

        partialUpdatedParcours.name(UPDATED_NAME).label(UPDATED_LABEL).offreId(UPDATED_OFFRE_ID);

        restParcoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParcours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParcours))
            )
            .andExpect(status().isOk());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
        Parcours testParcours = parcoursList.get(parcoursList.size() - 1);
        assertThat(testParcours.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParcours.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testParcours.getOffreId()).isEqualTo(UPDATED_OFFRE_ID);
    }

    @Test
    @Transactional
    void patchNonExistingParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parcours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parcours))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParcours() throws Exception {
        int databaseSizeBeforeUpdate = parcoursRepository.findAll().size();
        parcours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParcoursMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(parcours)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parcours in the database
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParcours() throws Exception {
        // Initialize the database
        parcoursRepository.saveAndFlush(parcours);

        int databaseSizeBeforeDelete = parcoursRepository.findAll().size();

        // Delete the parcours
        restParcoursMockMvc
            .perform(delete(ENTITY_API_URL_ID, parcours.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Parcours> parcoursList = parcoursRepository.findAll();
        assertThat(parcoursList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
