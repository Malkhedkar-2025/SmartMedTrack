package com.smartmedtrack.service;

import com.smartmedtrack.model.MedicineRequest;
import com.smartmedtrack.model.Role;
import com.smartmedtrack.model.User;
import com.smartmedtrack.repository.MedicineRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicineRequestService {

    @Autowired
    private MedicineRequestRepository requestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    public MedicineRequest createRequest(MedicineRequest request) {
        request.setStatus("PENDING");
        MedicineRequest savedRequest = requestRepository.save(request);

        // Notify all Pharmacists
        List<User> pharmacists = userService.findAllUsers().stream()
                .filter(u -> u.getRole() == Role.PHARMACIST)
                .toList();

        for (User p : pharmacists) {
            notificationService.createNotification(
                    "New refill request for " + savedRequest.getMedicine().getName() + " from "
                            + savedRequest.getRequester().getUsername(),
                    p.getId(),
                    "REFILL_REQUEST");
        }

        return savedRequest;
    }

    public List<MedicineRequest> findAllRequests() {
        return requestRepository.findAll();
    }

    public List<MedicineRequest> findByRequester(User requester) {
        return requestRepository.findByRequester(requester);
    }

    public MedicineRequest updateStatus(Long id, String status, User fullfiller) {
        MedicineRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        request.setFullfiller(fullfiller);
        MedicineRequest savedRequest = requestRepository.save(request);

        // Notify the requester
        notificationService.createNotification(
                "Your request for " + savedRequest.getMedicine().getName() + " has been " + status.toLowerCase(),
                savedRequest.getRequester().getId(),
                "STOCK_FILLED");

        return savedRequest;
    }
}
