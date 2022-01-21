package com.poc.simulation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BlocTransition.
 */
@Entity
@Table(name = "bloc_transition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BlocTransition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "transition", nullable = false)
    private Integer transition;

    @OneToOne
    @JoinColumn
    private EtapeDefinition etapeDefinition;

    @OneToOne
    @JoinColumn
    private ParcoursDefinition parcoursDefinition;

    @JsonIgnoreProperties(value = { "element" }, allowSetters = true)
    @OneToOne
    @JoinColumn
    private BlocDefinition current;

    @JsonIgnoreProperties(value = { "element" }, allowSetters = true)
    @OneToOne
    @JoinColumn
    private BlocDefinition next;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BlocTransition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTransition() {
        return this.transition;
    }

    public BlocTransition transition(Integer transition) {
        this.setTransition(transition);
        return this;
    }

    public void setTransition(Integer transition) {
        this.transition = transition;
    }

    public EtapeDefinition getEtapeDefinition() {
        return this.etapeDefinition;
    }

    public void setEtapeDefinition(EtapeDefinition etapeDefinition) {
        this.etapeDefinition = etapeDefinition;
    }

    public BlocTransition etapeDefinition(EtapeDefinition etapeDefinition) {
        this.setEtapeDefinition(etapeDefinition);
        return this;
    }

    public ParcoursDefinition getParcoursDefinition() {
        return this.parcoursDefinition;
    }

    public void setParcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.parcoursDefinition = parcoursDefinition;
    }

    public BlocTransition parcoursDefinition(ParcoursDefinition parcoursDefinition) {
        this.setParcoursDefinition(parcoursDefinition);
        return this;
    }

    public BlocDefinition getCurrent() {
        return this.current;
    }

    public void setCurrent(BlocDefinition blocDefinition) {
        this.current = blocDefinition;
    }

    public BlocTransition current(BlocDefinition blocDefinition) {
        this.setCurrent(blocDefinition);
        return this;
    }

    public BlocDefinition getNext() {
        return this.next;
    }

    public void setNext(BlocDefinition blocDefinition) {
        this.next = blocDefinition;
    }

    public BlocTransition next(BlocDefinition blocDefinition) {
        this.setNext(blocDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BlocTransition)) {
            return false;
        }
        return id != null && id.equals(((BlocTransition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlocTransition{" +
            "id=" + getId() +
            ", transition=" + getTransition() +
            "}";
    }
}
