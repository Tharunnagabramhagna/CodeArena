package com.codearena.config;

import com.codearena.util.AsyncActivityService;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ServletContextListener managing the lifecycle of the CodeArena application.
 * Initializes the database connection pool on startup and gracefully stops background threads on undeploy.
 */
@WebListener
public class AppLifecycleListener implements ServletContextListener {
    private static final Logger logger = LoggerFactory.getLogger(AppLifecycleListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        logger.info("=================================================");
        logger.info("Initializing CodeArena Backend Application...");
        try {
            // Eagerly verify database connection
            DatabaseConfig.getConnection().close();
            logger.info("CodeArena Database connection verified successfully.");
        } catch (Exception e) {
            logger.warn("Could not establish immediate database connection: {}. (Application will retry upon requests)", e.getMessage());
        }
        logger.info("CodeArena Backend initialized and ready.");
        logger.info("=================================================");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        logger.info("Shutting down CodeArena Backend Application...");
        AsyncActivityService.shutdown();
        DatabaseConfig.shutdown();
        logger.info("CodeArena resources cleaned up.");
    }
}

