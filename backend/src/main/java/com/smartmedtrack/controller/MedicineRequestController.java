package com.smartmedtrack.controller;

import com.smartmedtrack.model.MedicineRequest;
import com.smartmedtrack.service.MedicineRequestService;
import com.smartmedtrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class MedicineRequestController {

    @Autowired
    private MedicineRequestService requestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<MedicineRequest> createRequest(@RequestBody MedicineRequest request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @GetMapping
    public ResponseEntity<List<MedicineRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.findAllRequests());
    }

    @GetMapping("/requester/{username}")
    public ResponseEntity<List<MedicineRequest>> getRequestsByRequester(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(user -> ResponseEntity.ok(requestService.findByRequester(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MedicineRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam String fullfillerUsername) {

        return userService.findByUsername(fullfillerUsername)
                .map(user -> ResponseEntity.ok(requestService.updateStatus(id, status, user)))
                .orElse(ResponseEntity.badRequest().build());
    }
}
