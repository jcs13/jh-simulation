package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OffreComposition.
 */
@Entity
@Table(name = "offre_composition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OffreComposition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "inheritance_order", nullable = false)
    private Integer inheritanceOrder;

    @JsonIgnoreProperties(value = { "businessUnit" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Offre offre;

    @OneToOne
    @JoinColumn(unique = true)
    private ParcoursDefinition parcoursParent;

    @OneToOne
    @JoinColumn(unique = true)
    private ParcoursDefinition parcoursChild;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OffreComposition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getInheritanceOrder() {
        return this.inheritanceOrder;
    }

    public OffreComposition inheritanceOrder(Integer inheritanceOrder) {
        this.setInheritanceOrder(inheritanceOrder);
        return this;
    }

    public void setInheritanceOrder(Integer inheritanceOrder) {
        this.inheritanceOrder = inheritanceOrder;
    }

    public Offre getOffre() {
        return this.offre;
    }

    public void setOffre(Offre offre) {
        this.offre = offre;
    }

    public OffreComposition offre(Offre offre) {
        this.setOffre(offre);
        return this;
    }

    public ParcoursDefinition getParcoursParent() {
        return this.parcoursParent;
    }

    public void setParcoursParent(ParcoursDefinition parcoursDefinition) {
        this.parcoursParent = parcoursDefinition;
    }

    public OffreComposition parcoursParent(ParcoursDefinition parcoursDefinition) {
        this.setParcoursParent(parcoursDefinition);
        return this;
    }

    public ParcoursDefinition getParcoursChild() {
        return this.parcoursChild;
    }

    public void setParcoursChild(ParcoursDefinition parcoursDefinition) {
        this.parcoursChild = parcoursDefinition;
    }

    public OffreComposition parcoursChild(ParcoursDefinition parcoursDefinition) {
        this.setParcoursChild(parcoursDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OffreComposition)) {
            return false;
        }
        return id != null && id.equals(((OffreComposition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OffreComposition{" +
            "id=" + getId() +
            ", inheritanceOrder=" + getInheritanceOrder() +
            "}";
    }
}
