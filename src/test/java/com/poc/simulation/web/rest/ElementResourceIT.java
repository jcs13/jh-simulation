package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.Element;
import com.poc.simulation.repository.ElementRepository;
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
 * Integration tests for the {@link ElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ElementResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ElementRepository elementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restElementMockMvc;

    private Element element;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Element createEntity(EntityManager em) {
        Element element = new Element().name(DEFAULT_NAME).path(DEFAULT_PATH);
        return element;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Element createUpdatedEntity(EntityManager em) {
        Element element = new Element().name(UPDATED_NAME).path(UPDATED_PATH);
        return element;
    }

    @BeforeEach
    public void initTest() {
        element = createEntity(em);
    }

    @Test
    @Transactional
    void createElement() throws Exception {
        int databaseSizeBeforeCreate = elementRepository.findAll().size();
        // Create the Element
        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isCreated());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeCreate + 1);
        Element testElement = elementList.get(elementList.size() - 1);
        assertThat(testElement.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testElement.getPath()).isEqualTo(DEFAULT_PATH);
    }

    @Test
    @Transactional
    void createElementWithExistingId() throws Exception {
        // Create the Element with an existing ID
        element.setId(1L);

        int databaseSizeBeforeCreate = elementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = elementRepository.findAll().size();
        // set the field null
        element.setName(null);

        // Create the Element, which fails.

        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isBadRequest());

        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPathIsRequired() throws Exception {
        int databaseSizeBeforeTest = elementRepository.findAll().size();
        // set the field null
        element.setPath(null);

        // Create the Element, which fails.

        restElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isBadRequest());

        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllElements() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        // Get all the elementList
        restElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(element.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH)));
    }

    @Test
    @Transactional
    void getElement() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        // Get the element
        restElementMockMvc
            .perform(get(ENTITY_API_URL_ID, element.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(element.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH));
    }

    @Test
    @Transactional
    void getNonExistingElement() throws Exception {
        // Get the element
        restElementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewElement() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        int databaseSizeBeforeUpdate = elementRepository.findAll().size();

        // Update the element
        Element updatedElement = elementRepository.findById(element.getId()).get();
        // Disconnect from session so that the updates on updatedElement are not directly saved in db
        em.detach(updatedElement);
        updatedElement.name(UPDATED_NAME).path(UPDATED_PATH);

        restElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
        Element testElement = elementList.get(elementList.size() - 1);
        assertThat(testElement.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testElement.getPath()).isEqualTo(UPDATED_PATH);
    }

    @Test
    @Transactional
    void putNonExistingElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, element.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateElementWithPatch() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        int databaseSizeBeforeUpdate = elementRepository.findAll().size();

        // Update the element using partial update
        Element partialUpdatedElement = new Element();
        partialUpdatedElement.setId(element.getId());

        partialUpdatedElement.name(UPDATED_NAME).path(UPDATED_PATH);

        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
        Element testElement = elementList.get(elementList.size() - 1);
        assertThat(testElement.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testElement.getPath()).isEqualTo(UPDATED_PATH);
    }

    @Test
    @Transactional
    void fullUpdateElementWithPatch() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        int databaseSizeBeforeUpdate = elementRepository.findAll().size();

        // Update the element using partial update
        Element partialUpdatedElement = new Element();
        partialUpdatedElement.setId(element.getId());

        partialUpdatedElement.name(UPDATED_NAME).path(UPDATED_PATH);

        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedElement))
            )
            .andExpect(status().isOk());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
        Element testElement = elementList.get(elementList.size() - 1);
        assertThat(testElement.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testElement.getPath()).isEqualTo(UPDATED_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, element.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(element))
            )
            .andExpect(status().isBadRequest());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamElement() throws Exception {
        int databaseSizeBeforeUpdate = elementRepository.findAll().size();
        element.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(element)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Element in the database
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteElement() throws Exception {
        // Initialize the database
        elementRepository.saveAndFlush(element);

        int databaseSizeBeforeDelete = elementRepository.findAll().size();

        // Delete the element
        restElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, element.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Element> elementList = elementRepository.findAll();
        assertThat(elementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
