package com.poc.simulation.repository;

import com.poc.simulation.domain.OffreComposition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OffreComposition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffreCompositionRepository extends JpaRepository<OffreComposition, Long> {}
