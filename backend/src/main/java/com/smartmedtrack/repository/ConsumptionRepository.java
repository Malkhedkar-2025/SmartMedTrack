package com.smartmedtrack.repository;

import com.smartmedtrack.model.Consumption;
import com.smartmedtrack.model.Facility;
import com.smartmedtrack.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    List<Consumption> findByFacilityAndMedicineAndConsumptionDateAfter(Facility facility, Medicine medicine, LocalDateTime date);

    @Query("SELECT SUM(c.quantity) FROM Consumption c WHERE c.facility.id = :facilityId AND c.medicine.id = :medicineId AND c.consumptionDate > :startDate")
    Integer sumQuantityByFacilityAndMedicineAndDateAfter(Long facilityId, Long medicineId, LocalDateTime startDate);
}
