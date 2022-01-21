package com.poc.simulation.repository;

import com.poc.simulation.domain.BlocTransition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlocTransition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocTransitionRepository extends JpaRepository<BlocTransition, Long> {}
