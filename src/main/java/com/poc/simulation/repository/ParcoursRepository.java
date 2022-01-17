package com.poc.simulation.repository;

import com.poc.simulation.domain.Parcours;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Parcours entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParcoursRepository extends JpaRepository<Parcours, Long> {}
