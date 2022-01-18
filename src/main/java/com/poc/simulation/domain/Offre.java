package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Offre.
 */
@Entity
@Table(name = "offre")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Offre implements Serializable {

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

    @OneToMany(mappedBy = "offre")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "etapeDefinitions", "blocDefinitions", "offre" }, allowSetters = true)
    private Set<ParcoursDefinition> parcoursDefinitions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "offres" }, allowSetters = true)
    private BusinessUnit businessUnit;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Offre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Offre name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Offre label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Set<ParcoursDefinition> getParcoursDefinitions() {
        return this.parcoursDefinitions;
    }

    public void setParcoursDefinitions(Set<ParcoursDefinition> parcoursDefinitions) {
        if (this.parcoursDefinitions != null) {
            this.parcoursDefinitions.forEach(i -> i.setOffre(null));
        }
        if (parcoursDefinitions != null) {
            parcoursDefinitions.forEach(i -> i.setOffre(this));
        }
        this.parcoursDefinitions = parcoursDefinitions;
    }

    public Offre parcoursDefinitions(Set<ParcoursDefinition> parcoursDefinitions) {
        this.setParcoursDefinitions(parcoursDefinitions);
        return this;
    }

    public Offre addParcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.parcoursDefinitions.add(parcoursDefinition);
        parcoursDefinition.setOffre(this);
        return this;
    }

    public Offre removeParcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.parcoursDefinitions.remove(parcoursDefinition);
        parcoursDefinition.setOffre(null);
        return this;
    }

    public BusinessUnit getBusinessUnit() {
        return this.businessUnit;
    }

    public void setBusinessUnit(BusinessUnit businessUnit) {
        this.businessUnit = businessUnit;
    }

    public Offre businessUnit(BusinessUnit businessUnit) {
        this.setBusinessUnit(businessUnit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Offre)) {
            return false;
        }
        return id != null && id.equals(((Offre) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Offre{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            "}";
    }
}
