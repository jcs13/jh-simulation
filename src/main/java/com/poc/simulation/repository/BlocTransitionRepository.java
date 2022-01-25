package com.poc.simulation.repository;

import com.poc.simulation.domain.BlocTransition;
import com.poc.simulation.domain.EtapeDefinition;
import com.poc.simulation.domain.ParcoursDefinition;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlocTransition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlocTransitionRepository extends JpaRepository<BlocTransition, Long> {
    @Query(
        "SELECT bt FROM BlocTransition bt WHERE bt.parcoursDefinition = :parcoursDefinitions and bt.etapeDefinition = :etapeDefinition ORDER BY bt.transition"
    )
    List<BlocTransition> findByParcoursAndEtapesOrderByTransition(
        @Param("parcoursDefinitions") ParcoursDefinition parcoursDefinitions,
        @Param("etapeDefinition") EtapeDefinition etapeDefinition
    );
}
