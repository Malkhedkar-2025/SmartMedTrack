package com.smartmedtrack.repository;

import com.smartmedtrack.model.Inventory;
import com.smartmedtrack.model.Facility;
import com.smartmedtrack.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByFacilityAndMedicine(Facility facility, Medicine medicine);
    List<Inventory> findByFacility(Facility facility);
}
