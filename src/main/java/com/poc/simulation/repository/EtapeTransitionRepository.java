package com.poc.simulation.repository;

import com.poc.simulation.domain.EtapeTransition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EtapeTransition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtapeTransitionRepository extends JpaRepository<EtapeTransition, Long> {}
