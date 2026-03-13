package com.smartmedtrack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private Long recipientId;

    @Column(nullable = false)
    private String status; // UNREAD, READ

    @Column(nullable = false)
    private String type; // REFILL_REQUEST, STOCK_FILLED, SYSTEM

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
