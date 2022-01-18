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
 * A ParcoursDefinition.
 */
@Entity
@Table(name = "parcours_definition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ParcoursDefinition implements Serializable {

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

    @OneToMany(mappedBy = "parcoursDefinition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blocDefinitions", "parcoursDefinition" }, allowSetters = true)
    private Set<EtapeDefinition> etapeDefinitions = new HashSet<>();

    @OneToMany(mappedBy = "parcoursDefinition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "element", "etapeDefinition", "parcoursDefinition" }, allowSetters = true)
    private Set<BlocDefinition> blocDefinitions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "parcoursDefinitions", "businessUnit" }, allowSetters = true)
    private Offre offre;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ParcoursDefinition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ParcoursDefinition name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public ParcoursDefinition label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Set<EtapeDefinition> getEtapeDefinitions() {
        return this.etapeDefinitions;
    }

    public void setEtapeDefinitions(Set<EtapeDefinition> etapeDefinitions) {
        if (this.etapeDefinitions != null) {
            this.etapeDefinitions.forEach(i -> i.setParcoursDefinition(null));
        }
        if (etapeDefinitions != null) {
            etapeDefinitions.forEach(i -> i.setParcoursDefinition(this));
        }
        this.etapeDefinitions = etapeDefinitions;
    }

    public ParcoursDefinition etapeDefinitions(Set<EtapeDefinition> etapeDefinitions) {
        this.setEtapeDefinitions(etapeDefinitions);
        return this;
    }

    public ParcoursDefinition addEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinitions.add(etapeDefinition);
        etapeDefinition.setParcoursDefinition(this);
        return this;
    }

    public ParcoursDefinition removeEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinitions.remove(etapeDefinition);
        etapeDefinition.setParcoursDefinition(null);
        return this;
    }

    public Set<BlocDefinition> getBlocDefinitions() {
        return this.blocDefinitions;
    }

    public void setBlocDefinitions(Set<BlocDefinition> blocDefinitions) {
        if (this.blocDefinitions != null) {
            this.blocDefinitions.forEach(i -> i.setParcoursDefinition(null));
        }
        if (blocDefinitions != null) {
            blocDefinitions.forEach(i -> i.setParcoursDefinition(this));
        }
        this.blocDefinitions = blocDefinitions;
    }

    public ParcoursDefinition blocDefinitions(Set<BlocDefinition> blocDefinitions) {
        this.setBlocDefinitions(blocDefinitions);
        return this;
    }

    public ParcoursDefinition addBlocDefinition(BlocDefinition blocDefinition) {
        this.blocDefinitions.add(blocDefinition);
        blocDefinition.setParcoursDefinition(this);
        return this;
    }

    public ParcoursDefinition removeBlocDefinition(BlocDefinition blocDefinition) {
        this.blocDefinitions.remove(blocDefinition);
        blocDefinition.setParcoursDefinition(null);
        return this;
    }

    public Offre getOffre() {
        return this.offre;
    }

    public void setOffre(Offre offre) {
        this.offre = offre;
    }

    public ParcoursDefinition offre(Offre offre) {
        this.setOffre(offre);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParcoursDefinition)) {
            return false;
        }
        return id != null && id.equals(((ParcoursDefinition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParcoursDefinition{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            "}";
    }
}
