package com.smartmedtrack.service;

import com.smartmedtrack.model.Facility;
import com.smartmedtrack.model.Medicine;
import com.smartmedtrack.repository.ConsumptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ConsumptionRepository consumptionRepository;

    /**
     * Calculates weekly requirements based on the last 4 weeks of consumption.
     * Uses a simple average + 20% safety stock.
     */
    public Integer calculateWeeklyRequirement(Facility facility, Medicine medicine) {
        LocalDateTime fourWeeksAgo = LocalDateTime.now().minusWeeks(4);
        Integer totalConsumption = consumptionRepository.sumQuantityByFacilityAndMedicineAndDateAfter(facility.getId(), medicine.getId(), fourWeeksAgo);
        
        if (totalConsumption == null || totalConsumption == 0) {
            return 10; // Default minimum stock if no data
        }

        double weeklyAverage = totalConsumption / 4.0;
        return (int) Math.ceil(weeklyAverage * 1.2); // 20% safety stock buffer
    }
}
