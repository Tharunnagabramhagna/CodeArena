package com.codearena.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

/**
 * High-performance JDBC Connection Pool manager using HikariCP.
 * Thread-safe singleton providing pooled connections to DAOs.
 */
public final class DatabaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    private static volatile HikariDataSource dataSource;
    private static final Object lock = new Object();

    private DatabaseConfig() {
        // Prevent instantiation
    }

    /**
     * Obtains a pooled JDBC connection.
     * @return active java.sql.Connection
     * @throws SQLException if pool exhausted or database unavailable
     */
    public static Connection getConnection() throws SQLException {
        if (dataSource == null) {
            synchronized (lock) {
                if (dataSource == null) {
                    initDataSource();
                }
            }
        }
        return dataSource.getConnection();
    }

    private static void initDataSource() {
        try {
            Properties props = new Properties();
            try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
                if (input != null) {
                    props.load(input);
                } else {
                    logger.warn("db.properties not found on classpath, relying on defaults/environment.");
                }
            }

            // Environment variable overrides (useful for Docker/Cloud deployment)
            String driver = System.getenv("DB_DRIVER");
            if (driver == null || driver.isBlank()) {
                driver = props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
            }

            String url = System.getenv("DB_URL");
            if (url == null || url.isBlank()) {
                url = props.getProperty("db.url", "jdbc:mysql://localhost:3306/codearena_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
            }

            String user = System.getenv("DB_USERNAME");
            if (user == null || user.isBlank()) {
                user = props.getProperty("db.username", "root");
            }

            String password = System.getenv("DB_PASSWORD");
            if (password == null) {
                password = props.getProperty("db.password", "root");
            }

            HikariConfig config = new HikariConfig();
            config.setDriverClassName(driver);
            config.setJdbcUrl(url);
            config.setUsername(user);
            config.setPassword(password);

            config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.maximumPoolSize", "10")));
            config.setMinimumIdle(Integer.parseInt(props.getProperty("db.pool.minimumIdle", "2")));
            config.setIdleTimeout(Long.parseLong(props.getProperty("db.pool.idleTimeout", "30000")));
            config.setConnectionTimeout(Long.parseLong(props.getProperty("db.pool.connectionTimeout", "10000")));
            config.setMaxLifetime(Long.parseLong(props.getProperty("db.pool.maxLifetime", "1800000")));
            config.setPoolName("CodeArena-HikariPool");

            // Recommended MySQL performance optimizations
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            config.addDataSourceProperty("useServerPrepStmts", "true");

            dataSource = new HikariDataSource(config);
            logger.info("HikariCP connection pool initialized successfully for URL: {}", url);
        } catch (Exception e) {
            logger.error("Failed to initialize HikariCP connection pool: {}", e.getMessage(), e);
            throw new RuntimeException("Database pool initialization failed", e);
        }
    }

    /**
     * Cleanly shuts down the connection pool upon application undeploy.
     */
    public static void shutdown() {
        synchronized (lock) {
            if (dataSource != null && !dataSource.isClosed()) {
                dataSource.close();
                dataSource = null;
                logger.info("HikariCP connection pool closed cleanly.");
            }
        }
    }
}

