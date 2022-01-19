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
 * A EtapeDefinition.
 */
@Entity
@Table(name = "etape_definition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EtapeDefinition implements Serializable {

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

    @OneToMany(mappedBy = "etapeDefinition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "element", "etapeDefinition", "parcoursDefinition" }, allowSetters = true)
    private Set<BlocDefinition> blocDefinitions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "etapeDefinitions", "blocDefinitions", "offre" }, allowSetters = true)
    private ParcoursDefinition parcoursDefinition;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EtapeDefinition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public EtapeDefinition name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public EtapeDefinition label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Set<BlocDefinition> getBlocDefinitions() {
        return this.blocDefinitions;
    }

    public void setBlocDefinitions(Set<BlocDefinition> blocDefinitions) {
        if (this.blocDefinitions != null) {
            this.blocDefinitions.forEach(i -> i.setEtapeDefinition(null));
        }
        if (blocDefinitions != null) {
            blocDefinitions.forEach(i -> i.setEtapeDefinition(this));
        }
        this.blocDefinitions = blocDefinitions;
    }

    public EtapeDefinition blocDefinitions(Set<BlocDefinition> blocDefinitions) {
        this.setBlocDefinitions(blocDefinitions);
        return this;
    }

    public EtapeDefinition addBlocDefinition(BlocDefinition blocDefinition) {
        this.blocDefinitions.add(blocDefinition);
        blocDefinition.setEtapeDefinition(this);
        return this;
    }

    public EtapeDefinition removeBlocDefinition(BlocDefinition blocDefinition) {
        this.blocDefinitions.remove(blocDefinition);
        blocDefinition.setEtapeDefinition(null);
        return this;
    }

    public ParcoursDefinition getParcoursDefinition() {
        return this.parcoursDefinition;
    }

    public void setParcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.parcoursDefinition = parcoursDefinition;
    }

    public EtapeDefinition parcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.setParcoursDefinition(parcoursDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EtapeDefinition)) {
            return false;
        }
        return id != null && id.equals(((EtapeDefinition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EtapeDefinition{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            "}";
    }
}
