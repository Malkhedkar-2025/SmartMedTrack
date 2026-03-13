package com.smartmedtrack.repository;

import com.smartmedtrack.model.MedicineRequest;
import com.smartmedtrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRequestRepository extends JpaRepository<MedicineRequest, Long> {
    List<MedicineRequest> findByRequester(User requester);

    List<MedicineRequest> findByStatus(String status);
}
