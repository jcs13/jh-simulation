package com.poc.simulation.repository;

import com.poc.simulation.domain.Bloc;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bloc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {}
