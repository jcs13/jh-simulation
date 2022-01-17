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
 * A Parcours.
 */
@Entity
@Table(name = "parcours")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Parcours implements Serializable {

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
    @Column(name = "offre_id", nullable = false)
    private String offreId;

    @OneToMany(mappedBy = "parcours", cascade = CascadeType.PERSIST)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blocs", "parcours" }, allowSetters = true)
    private Set<Etape> etapes = new HashSet<>();

    @JsonIgnoreProperties(value = { "parcours", "parent" }, allowSetters = true)
    @OneToOne(mappedBy = "parcours")
    private Simulation simulation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parcours id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Parcours name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Parcours label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getOffreId() {
        return this.offreId;
    }

    public Parcours offreId(String offreId) {
        this.setOffreId(offreId);
        return this;
    }

    public void setOffreId(String offreId) {
        this.offreId = offreId;
    }

    public Set<Etape> getEtapes() {
        return this.etapes;
    }

    public void setEtapes(Set<Etape> etapes) {
        if (this.etapes != null) {
            this.etapes.forEach(i -> i.setParcours(null));
        }
        if (etapes != null) {
            etapes.forEach(i -> i.setParcours(this));
        }
        this.etapes = etapes;
    }

    public Parcours etapes(Set<Etape> etapes) {
        this.setEtapes(etapes);
        return this;
    }

    public Parcours addEtape(Etape etape) {
        this.etapes.add(etape);
        etape.setParcours(this);
        return this;
    }

    public Parcours removeEtape(Etape etape) {
        this.etapes.remove(etape);
        etape.setParcours(null);
        return this;
    }

    public Simulation getSimulation() {
        return this.simulation;
    }

    public void setSimulation(Simulation simulation) {
        if (this.simulation != null) {
            this.simulation.setParcours(null);
        }
        if (simulation != null) {
            simulation.setParcours(this);
        }
        this.simulation = simulation;
    }

    public Parcours simulation(Simulation simulation) {
        this.setSimulation(simulation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parcours)) {
            return false;
        }
        return id != null && id.equals(((Parcours) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parcours{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", offreId='" + getOffreId() + "'" +
            "}";
    }
}
