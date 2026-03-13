package com.smartmedtrack.controller;

import com.smartmedtrack.model.Facility;
import com.smartmedtrack.model.Inventory;
import com.smartmedtrack.model.Medicine;
import com.smartmedtrack.repository.FacilityRepository;
import com.smartmedtrack.repository.InventoryRepository;
import com.smartmedtrack.repository.MedicineRepository;
import com.smartmedtrack.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final FacilityRepository facilityRepository;
    private final MedicineRepository medicineRepository;
    private final AnalyticsService analyticsService;

    @GetMapping("/facility/{facilityId}")
    public List<Inventory> getInventoryByFacility(@PathVariable Long facilityId) {
        return inventoryRepository.findByFacility(facilityRepository.findById(facilityId).orElseThrow());
    }

    @GetMapping("/requirements/{facilityId}/{medicineId}")
    public ResponseEntity<Map<String, Object>> getRequirements(@PathVariable Long facilityId,
            @PathVariable Long medicineId) {
        Facility facility = facilityRepository.findById(facilityId).orElseThrow();
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow();

        Integer requirement = analyticsService.calculateWeeklyRequirement(facility, medicine);

        Map<String, Object> response = new HashMap<>();
        response.put("medicine", medicine.getName());
        response.put("facility", facility.getName());
        response.put("weeklyRequirement", requirement);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/medicine/{medicineId}/availability")
    public List<Map<String, Object>> getCrossFacilityAvailability(@PathVariable Long medicineId) {
        List<Inventory> inventories = inventoryRepository.findAll().stream()
                .filter(i -> i.getMedicine().getId().equals(medicineId))
                .toList();

        return inventories.stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("facilityName", i.getFacility().getName());
            map.put("facilityType", i.getFacility().getType());
            map.put("quantity", i.getQuantity());
            map.put("location", i.getFacility().getLocation());
            return map;
        }).toList();
    }
}
