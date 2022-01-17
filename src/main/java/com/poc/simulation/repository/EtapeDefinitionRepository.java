package com.poc.simulation.repository;

import com.poc.simulation.domain.EtapeDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EtapeDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtapeDefinitionRepository extends JpaRepository<EtapeDefinition, Long> {}
