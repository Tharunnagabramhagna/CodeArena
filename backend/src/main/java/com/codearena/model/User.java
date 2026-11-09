package com.codearena.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Represents a registered user account on the CodeArena platform.
 * Person 4 Responsibility: Core authentication entity.
 */
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String email;
    private transient String passwordHash; // Avoid accidental exposure in serialization
    private transient String salt;
    private String fullName;
    private Role role;
    private boolean active;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Optional associated profile for full student context
    private StudentProfile profile;

    public User() {
        this.role = Role.STUDENT;
        this.active = true;
    }

    public User(int id, String email, String fullName, Role role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role != null ? role : Role.STUDENT;
        this.active = true;
    }

    public User(String email, String passwordHash, String fullName, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role != null ? role : Role.STUDENT;
        this.active = true;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public StudentProfile getProfile() {
        return profile;
    }

    public void setProfile(StudentProfile profile) {
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", role=" + role +
                ", active=" + active +
                '}';
    }
}

