package com.poc.simulation.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.poc.simulation.IntegrationTest;
import com.poc.simulation.domain.Bloc;
import com.poc.simulation.repository.BlocRepository;
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
 * Integration tests for the {@link BlocResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlocResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_ELEMENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ELEMENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ELEMENT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_ELEMENT_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_ETAPE_DEFINITION_ID = "AAAAAAAAAA";
    private static final String UPDATED_ETAPE_DEFINITION_ID = "BBBBBBBBBB";

    private static final String DEFAULT_BLOC_DEFINITION_ID = "AAAAAAAAAA";
    private static final String UPDATED_BLOC_DEFINITION_ID = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DISPLAY = false;
    private static final Boolean UPDATED_DISPLAY = true;

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final String ENTITY_API_URL = "/api/blocs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlocRepository blocRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlocMockMvc;

    private Bloc bloc;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloc createEntity(EntityManager em) {
        Bloc bloc = new Bloc()
            .name(DEFAULT_NAME)
            .label(DEFAULT_LABEL)
            .elementName(DEFAULT_ELEMENT_NAME)
            .elementPath(DEFAULT_ELEMENT_PATH)
            .etapeDefinitionId(DEFAULT_ETAPE_DEFINITION_ID)
            .blocDefinitionId(DEFAULT_BLOC_DEFINITION_ID)
            .display(DEFAULT_DISPLAY)
            .order(DEFAULT_ORDER);
        return bloc;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bloc createUpdatedEntity(EntityManager em) {
        Bloc bloc = new Bloc()
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .elementName(UPDATED_ELEMENT_NAME)
            .elementPath(UPDATED_ELEMENT_PATH)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .blocDefinitionId(UPDATED_BLOC_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);
        return bloc;
    }

    @BeforeEach
    public void initTest() {
        bloc = createEntity(em);
    }

    @Test
    @Transactional
    void createBloc() throws Exception {
        int databaseSizeBeforeCreate = blocRepository.findAll().size();
        // Create the Bloc
        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isCreated());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeCreate + 1);
        Bloc testBloc = blocList.get(blocList.size() - 1);
        assertThat(testBloc.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBloc.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBloc.getElementName()).isEqualTo(DEFAULT_ELEMENT_NAME);
        assertThat(testBloc.getElementPath()).isEqualTo(DEFAULT_ELEMENT_PATH);
        assertThat(testBloc.getEtapeDefinitionId()).isEqualTo(DEFAULT_ETAPE_DEFINITION_ID);
        assertThat(testBloc.getBlocDefinitionId()).isEqualTo(DEFAULT_BLOC_DEFINITION_ID);
        assertThat(testBloc.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
        assertThat(testBloc.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void createBlocWithExistingId() throws Exception {
        // Create the Bloc with an existing ID
        bloc.setId(1L);

        int databaseSizeBeforeCreate = blocRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setName(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setLabel(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkElementNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setElementName(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkElementPathIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setElementPath(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtapeDefinitionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setEtapeDefinitionId(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBlocDefinitionIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setBlocDefinitionId(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDisplayIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setDisplay(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = blocRepository.findAll().size();
        // set the field null
        bloc.setOrder(null);

        // Create the Bloc, which fails.

        restBlocMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isBadRequest());

        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlocs() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        // Get all the blocList
        restBlocMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloc.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].elementName").value(hasItem(DEFAULT_ELEMENT_NAME)))
            .andExpect(jsonPath("$.[*].elementPath").value(hasItem(DEFAULT_ELEMENT_PATH)))
            .andExpect(jsonPath("$.[*].etapeDefinitionId").value(hasItem(DEFAULT_ETAPE_DEFINITION_ID)))
            .andExpect(jsonPath("$.[*].blocDefinitionId").value(hasItem(DEFAULT_BLOC_DEFINITION_ID)))
            .andExpect(jsonPath("$.[*].display").value(hasItem(DEFAULT_DISPLAY.booleanValue())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)));
    }

    @Test
    @Transactional
    void getBloc() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        // Get the bloc
        restBlocMockMvc
            .perform(get(ENTITY_API_URL_ID, bloc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bloc.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.elementName").value(DEFAULT_ELEMENT_NAME))
            .andExpect(jsonPath("$.elementPath").value(DEFAULT_ELEMENT_PATH))
            .andExpect(jsonPath("$.etapeDefinitionId").value(DEFAULT_ETAPE_DEFINITION_ID))
            .andExpect(jsonPath("$.blocDefinitionId").value(DEFAULT_BLOC_DEFINITION_ID))
            .andExpect(jsonPath("$.display").value(DEFAULT_DISPLAY.booleanValue()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER));
    }

    @Test
    @Transactional
    void getNonExistingBloc() throws Exception {
        // Get the bloc
        restBlocMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBloc() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        int databaseSizeBeforeUpdate = blocRepository.findAll().size();

        // Update the bloc
        Bloc updatedBloc = blocRepository.findById(bloc.getId()).get();
        // Disconnect from session so that the updates on updatedBloc are not directly saved in db
        em.detach(updatedBloc);
        updatedBloc
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .elementName(UPDATED_ELEMENT_NAME)
            .elementPath(UPDATED_ELEMENT_PATH)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .blocDefinitionId(UPDATED_BLOC_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);

        restBlocMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBloc.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBloc))
            )
            .andExpect(status().isOk());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
        Bloc testBloc = blocList.get(blocList.size() - 1);
        assertThat(testBloc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBloc.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBloc.getElementName()).isEqualTo(UPDATED_ELEMENT_NAME);
        assertThat(testBloc.getElementPath()).isEqualTo(UPDATED_ELEMENT_PATH);
        assertThat(testBloc.getEtapeDefinitionId()).isEqualTo(UPDATED_ETAPE_DEFINITION_ID);
        assertThat(testBloc.getBlocDefinitionId()).isEqualTo(UPDATED_BLOC_DEFINITION_ID);
        assertThat(testBloc.getDisplay()).isEqualTo(UPDATED_DISPLAY);
        assertThat(testBloc.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bloc.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bloc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bloc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlocWithPatch() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        int databaseSizeBeforeUpdate = blocRepository.findAll().size();

        // Update the bloc using partial update
        Bloc partialUpdatedBloc = new Bloc();
        partialUpdatedBloc.setId(bloc.getId());

        partialUpdatedBloc.name(UPDATED_NAME).elementPath(UPDATED_ELEMENT_PATH);

        restBlocMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBloc))
            )
            .andExpect(status().isOk());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
        Bloc testBloc = blocList.get(blocList.size() - 1);
        assertThat(testBloc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBloc.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBloc.getElementName()).isEqualTo(DEFAULT_ELEMENT_NAME);
        assertThat(testBloc.getElementPath()).isEqualTo(UPDATED_ELEMENT_PATH);
        assertThat(testBloc.getEtapeDefinitionId()).isEqualTo(DEFAULT_ETAPE_DEFINITION_ID);
        assertThat(testBloc.getBlocDefinitionId()).isEqualTo(DEFAULT_BLOC_DEFINITION_ID);
        assertThat(testBloc.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
        assertThat(testBloc.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateBlocWithPatch() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        int databaseSizeBeforeUpdate = blocRepository.findAll().size();

        // Update the bloc using partial update
        Bloc partialUpdatedBloc = new Bloc();
        partialUpdatedBloc.setId(bloc.getId());

        partialUpdatedBloc
            .name(UPDATED_NAME)
            .label(UPDATED_LABEL)
            .elementName(UPDATED_ELEMENT_NAME)
            .elementPath(UPDATED_ELEMENT_PATH)
            .etapeDefinitionId(UPDATED_ETAPE_DEFINITION_ID)
            .blocDefinitionId(UPDATED_BLOC_DEFINITION_ID)
            .display(UPDATED_DISPLAY)
            .order(UPDATED_ORDER);

        restBlocMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBloc))
            )
            .andExpect(status().isOk());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
        Bloc testBloc = blocList.get(blocList.size() - 1);
        assertThat(testBloc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBloc.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBloc.getElementName()).isEqualTo(UPDATED_ELEMENT_NAME);
        assertThat(testBloc.getElementPath()).isEqualTo(UPDATED_ELEMENT_PATH);
        assertThat(testBloc.getEtapeDefinitionId()).isEqualTo(UPDATED_ETAPE_DEFINITION_ID);
        assertThat(testBloc.getBlocDefinitionId()).isEqualTo(UPDATED_BLOC_DEFINITION_ID);
        assertThat(testBloc.getDisplay()).isEqualTo(UPDATED_DISPLAY);
        assertThat(testBloc.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bloc.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bloc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bloc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBloc() throws Exception {
        int databaseSizeBeforeUpdate = blocRepository.findAll().size();
        bloc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlocMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bloc)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bloc in the database
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBloc() throws Exception {
        // Initialize the database
        blocRepository.saveAndFlush(bloc);

        int databaseSizeBeforeDelete = blocRepository.findAll().size();

        // Delete the bloc
        restBlocMockMvc
            .perform(delete(ENTITY_API_URL_ID, bloc.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bloc> blocList = blocRepository.findAll();
        assertThat(blocList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
