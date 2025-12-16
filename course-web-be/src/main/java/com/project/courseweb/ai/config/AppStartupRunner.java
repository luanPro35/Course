package com.project.courseweb.ai.config;

import com.project.courseweb.ai.data.DataLoader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
// @Profile("!test") // Tùy chọn: Không chạy khi chạy Unit Test
public class AppStartupRunner implements CommandLineRunner {

    private final DataLoader dataLoader;

    @Override
    public void run(String... args) {
        log.info("Application started. Syncing course data to Vector Store...");
        dataLoader.loadDataVector();
    }
}