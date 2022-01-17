package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bloc.
 */
@Entity
@Table(name = "bloc")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bloc implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @NotNull
    @Column(name = "element_name", nullable = false)
    private String elementName;

    @NotNull
    @Column(name = "element_path", nullable = false)
    private String elementPath;

    @NotNull
    @Column(name = "etape_definition_id", nullable = false)
    private String etapeDefinitionId;

    @NotNull
    @Column(name = "bloc_definition_id", nullable = false)
    private String blocDefinitionId;

    @NotNull
    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @ManyToOne
    @JsonIgnoreProperties(value = { "blocs", "parcours" }, allowSetters = true)
    private Etape etape;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bloc id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Bloc name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Bloc label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getElementName() {
        return this.elementName;
    }

    public Bloc elementName(String elementName) {
        this.setElementName(elementName);
        return this;
    }

    public void setElementName(String elementName) {
        this.elementName = elementName;
    }

    public String getElementPath() {
        return this.elementPath;
    }

    public Bloc elementPath(String elementPath) {
        this.setElementPath(elementPath);
        return this;
    }

    public void setElementPath(String elementPath) {
        this.elementPath = elementPath;
    }

    public String getEtapeDefinitionId() {
        return this.etapeDefinitionId;
    }

    public Bloc etapeDefinitionId(String etapeDefinitionId) {
        this.setEtapeDefinitionId(etapeDefinitionId);
        return this;
    }

    public void setEtapeDefinitionId(String etapeDefinitionId) {
        this.etapeDefinitionId = etapeDefinitionId;
    }

    public String getBlocDefinitionId() {
        return this.blocDefinitionId;
    }

    public Bloc blocDefinitionId(String blocDefinitionId) {
        this.setBlocDefinitionId(blocDefinitionId);
        return this;
    }

    public void setBlocDefinitionId(String blocDefinitionId) {
        this.blocDefinitionId = blocDefinitionId;
    }

    public Boolean getDisplay() {
        return this.display;
    }

    public Bloc display(Boolean display) {
        this.setDisplay(display);
        return this;
    }

    public void setDisplay(Boolean display) {
        this.display = display;
    }

    public Integer getOrder() {
        return this.order;
    }

    public Bloc order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Etape getEtape() {
        return this.etape;
    }

    public void setEtape(Etape etape) {
        this.etape = etape;
    }

    public Bloc etape(Etape etape) {
        this.setEtape(etape);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bloc)) {
            return false;
        }
        return id != null && id.equals(((Bloc) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bloc{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", elementName='" + getElementName() + "'" +
            ", elementPath='" + getElementPath() + "'" +
            ", etapeDefinitionId='" + getEtapeDefinitionId() + "'" +
            ", blocDefinitionId='" + getBlocDefinitionId() + "'" +
            ", display='" + getDisplay() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
