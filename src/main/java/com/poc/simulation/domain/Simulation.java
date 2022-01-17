package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Simulation.
 */
@Entity
@Table(name = "simulation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Simulation implements Serializable {

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

    @Column(name = "affaire")
    private String affaire;

    @Column(name = "client")
    private String client;

    @Column(name = "parc")
    private String parc;

    @Column(name = "adresse_installation")
    private String adresseInstallation;

    @Column(name = "status")
    private String status;

    @NotNull
    @Column(name = "created", nullable = false)
    private LocalDate created;

    @Column(name = "modifier")
    private LocalDate modifier;

    @JsonIgnoreProperties(value = { "etapes", "simulation" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Parcours parcours;

    @JsonIgnoreProperties(value = { "parcours", "parent" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Simulation parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Simulation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Simulation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAffaire() {
        return this.affaire;
    }

    public Simulation affaire(String affaire) {
        this.setAffaire(affaire);
        return this;
    }

    public void setAffaire(String affaire) {
        this.affaire = affaire;
    }

    public String getClient() {
        return this.client;
    }

    public Simulation client(String client) {
        this.setClient(client);
        return this;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getParc() {
        return this.parc;
    }

    public Simulation parc(String parc) {
        this.setParc(parc);
        return this;
    }

    public void setParc(String parc) {
        this.parc = parc;
    }

    public String getAdresseInstallation() {
        return this.adresseInstallation;
    }

    public Simulation adresseInstallation(String adresseInstallation) {
        this.setAdresseInstallation(adresseInstallation);
        return this;
    }

    public void setAdresseInstallation(String adresseInstallation) {
        this.adresseInstallation = adresseInstallation;
    }

    public String getStatus() {
        return this.status;
    }

    public Simulation status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCreated() {
        return this.created;
    }

    public Simulation created(LocalDate created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }

    public LocalDate getModifier() {
        return this.modifier;
    }

    public Simulation modifier(LocalDate modifier) {
        this.setModifier(modifier);
        return this;
    }

    public void setModifier(LocalDate modifier) {
        this.modifier = modifier;
    }

    public Parcours getParcours() {
        return this.parcours;
    }

    public void setParcours(Parcours parcours) {
        this.parcours = parcours;
    }

    public Simulation parcours(Parcours parcours) {
        this.setParcours(parcours);
        return this;
    }

    public Simulation getParent() {
        return this.parent;
    }

    public void setParent(Simulation simulation) {
        this.parent = simulation;
    }

    public Simulation parent(Simulation simulation) {
        this.setParent(simulation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Simulation)) {
            return false;
        }
        return id != null && id.equals(((Simulation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Simulation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", affaire='" + getAffaire() + "'" +
            ", client='" + getClient() + "'" +
            ", parc='" + getParc() + "'" +
            ", adresseInstallation='" + getAdresseInstallation() + "'" +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            ", modifier='" + getModifier() + "'" +
            "}";
    }
}
