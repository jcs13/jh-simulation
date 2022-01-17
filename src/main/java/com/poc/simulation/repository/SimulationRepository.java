package com.poc.simulation.repository;

import com.poc.simulation.domain.Simulation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Simulation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SimulationRepository extends JpaRepository<Simulation, Long> {}
