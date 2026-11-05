package com.codearena.student;

import com.codearena.model.StudentProfile;

import java.util.Optional;

/**
 * Data Access Object interface for student profile operations.
 */
public interface StudentProfileDAO {
    /**
     * Initializes a default profile for a newly registered student.
     */
    StudentProfile create(StudentProfile profile);

    /**
     * Retrieves the profile associated with a given user ID.
     */
    Optional<StudentProfile> findByUserId(int userId);

    /**
     * Updates editable profile fields (bio, links, preferred language).
     */
    boolean updateProfile(StudentProfile profile);

    /**
     * Increments solved problems and updates ranking score.
     */
    boolean incrementProblemsSolved(int userId, int scoreIncrement);
}

