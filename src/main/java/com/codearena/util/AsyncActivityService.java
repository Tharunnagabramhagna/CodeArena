package com.codearena.util;

import com.codearena.config.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.concurrent.*;

/**
 * Thread pool service executing background tasks such as activity logging,
 * audit trails, and student streak updates asynchronously.
 * Demonstrates multithreading and concurrent task execution in Java.
 */
public final class AsyncActivityService {
    private static final Logger logger = LoggerFactory.getLogger(AsyncActivityService.class);

    // Thread pool with bounded queue for non-blocking asynchronous operations
    private static final ExecutorService executorService = new ThreadPoolExecutor(
            2,
            6,
            60L,
            TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(500),
            new ThreadFactory() {
                private int counter = 0;
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "CodeArena-AsyncWorker-" + (++counter));
                    t.setDaemon(true);
                    return t;
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy()
    );

    private AsyncActivityService() {
    }

    /**
     * Asynchronously records an activity audit entry into the database.
     */
    public static void logActivityAsync(int userId, String action, String details, String ipAddress) {
        executorService.submit(() -> {
            String sql = "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)";
            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, userId);
                stmt.setString(2, action);
                stmt.setString(3, details);
                stmt.setString(4, ipAddress);
                stmt.executeUpdate();
            } catch (SQLException e) {
                logger.warn("Asynchronous activity logging failed for user {}: {}", userId, e.getMessage());
            }
        });
    }

    /**
     * Asynchronously updates the student daily streak upon login or submission.
     */
    public static void updateStreakAsync(int userId) {
        executorService.submit(() -> {
            String sql = "UPDATE student_profiles " +
                    "SET streak_days = CASE " +
                    "    WHEN last_active_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) THEN streak_days + 1 " +
                    "    WHEN last_active_date = CURRENT_DATE() THEN streak_days " +
                    "    ELSE 1 " +
                    "END, " +
                    "last_active_date = CURRENT_DATE() " +
                    "WHERE user_id = ?";
            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, userId);
                stmt.executeUpdate();
            } catch (SQLException e) {
                logger.warn("Asynchronous streak update failed for user {}: {}", userId, e.getMessage());
            }
        });
    }

    /**
     * Cleanly shuts down background executor threads.
     */
    public static void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(3, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

