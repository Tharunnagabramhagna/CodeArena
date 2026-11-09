package com.codearena.student;

import com.codearena.model.StudentProgress;

import java.util.List;
import java.util.Optional;

/**
 * Data Access Object for tracking student learning progress across topics.
 */
public interface StudentProgressDAO {
    /**
     * Retrieves all topic progress records for a student.
     */
    List<StudentProgress> findByUserId(int userId);

    /**
     * Finds progress in a specific topic for a student.
     */
    Optional<StudentProgress> findByUserAndTopic(int userId, String topic);

    /**
     * Records an attempt or solved problem in a specific topic.
     */
    boolean recordProgress(int userId, String topic, boolean solved);

    /**
     * Initializes default topics for a new student.
     */
    void initializeDefaultTopics(int userId);
}

