package com.poc.simulation.repository;

import com.poc.simulation.domain.BusinessUnit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BusinessUnit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessUnitRepository extends JpaRepository<BusinessUnit, Long> {}
