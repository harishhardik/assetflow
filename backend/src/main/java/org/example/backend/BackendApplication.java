package org.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        autoCreateDatabase();
        SpringApplication.run(BackendApplication.class, args);
    }

    private static void autoCreateDatabase() {
        Properties props = new Properties();
        try (InputStream input = BackendApplication.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                System.out.println("Unable to find application.properties");
                return;
            }
            props.load(input);
        } catch (Exception e) {
            System.err.println("Failed to load application.properties: " + e.getMessage());
            return;
        }

        String url = props.getProperty("spring.datasource.url");
        String username = props.getProperty("spring.datasource.username");
        String password = props.getProperty("spring.datasource.password");

        if (url == null || username == null) {
            return;
        }

        // Resolve password placeholder if present (e.g. ${DB_PASSWORD:postgres})
        if (password != null && password.startsWith("${") && password.endsWith("}")) {
            String content = password.substring(2, password.length() - 1);
            String envName = content;
            String defaultValue = "";
            if (content.contains(":")) {
                int colonIndex = content.indexOf(":");
                envName = content.substring(0, colonIndex);
                defaultValue = content.substring(colonIndex + 1);
            }
            String envValue = System.getenv(envName);
            password = (envValue != null) ? envValue : defaultValue;
        }

        // Replace database name with postgres in connection URL
        int lastSlash = url.lastIndexOf("/");
        if (lastSlash == -1) {
            return;
        }
        String postgresUrl = url.substring(0, lastSlash) + "/postgres";
        String dbName = url.substring(lastSlash + 1);

        try (Connection conn = DriverManager.getConnection(postgresUrl, username, password)) {
            // Check if database exists
            try (PreparedStatement stmt = conn.prepareStatement("SELECT 1 FROM pg_database WHERE datname = ?")) {
                stmt.setString(1, dbName);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next()) {
                        // Create database if not exists
                        try (Statement createStmt = conn.createStatement()) {
                            createStmt.executeUpdate("CREATE DATABASE " + dbName);
                            System.out.println("Database '" + dbName + "' did not exist and was created successfully.");
                        }
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("Automatic database check failed: " + e.getMessage());
        }
    }
}
