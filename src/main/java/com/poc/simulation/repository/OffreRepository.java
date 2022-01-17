package com.poc.simulation.repository;

import com.poc.simulation.domain.Offre;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Offre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {}
