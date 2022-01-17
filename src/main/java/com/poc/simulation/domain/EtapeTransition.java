package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EtapeTransition.
 */
@Entity
@Table(name = "etape_transition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EtapeTransition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "transition", nullable = false)
    private Integer transition;

    @JsonIgnoreProperties(value = { "etapeDefinitions", "offre" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ParcoursDefinition parcoursDefinition;

    @JsonIgnoreProperties(value = { "blocDefinitions", "parcoursDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EtapeDefinition current;

    @JsonIgnoreProperties(value = { "blocDefinitions", "parcoursDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private EtapeDefinition next;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EtapeTransition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTransition() {
        return this.transition;
    }

    public EtapeTransition transition(Integer transition) {
        this.setTransition(transition);
        return this;
    }

    public void setTransition(Integer transition) {
        this.transition = transition;
    }

    public ParcoursDefinition getParcoursDefinition() {
        return this.parcoursDefinition;
    }

    public void setParcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.parcoursDefinition = parcoursDefinition;
    }

    public EtapeTransition parcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.setParcoursDefinition(parcoursDefinition);
        return this;
    }

    public EtapeDefinition getCurrent() {
        return this.current;
    }

    public void setCurrent(EtapeDefinition etapeDefinition) {
        this.current = etapeDefinition;
    }

    public EtapeTransition current(EtapeDefinition etapeDefinition) {
        this.setCurrent(etapeDefinition);
        return this;
    }

    public EtapeDefinition getNext() {
        return this.next;
    }

    public void setNext(EtapeDefinition etapeDefinition) {
        this.next = etapeDefinition;
    }

    public EtapeTransition next(EtapeDefinition etapeDefinition) {
        this.setNext(etapeDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EtapeTransition)) {
            return false;
        }
        return id != null && id.equals(((EtapeTransition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EtapeTransition{" +
            "id=" + getId() +
            ", transition=" + getTransition() +
            "}";
    }
}
