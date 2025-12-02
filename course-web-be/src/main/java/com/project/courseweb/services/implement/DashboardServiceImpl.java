package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.response.DashboardStatsResponse;
import com.project.courseweb.dtos.response.MonthlyOrderStats;
import com.project.courseweb.repositories.AuthRepository;
import com.project.courseweb.repositories.CourseRepository;
import com.project.courseweb.repositories.OrderRepository;
import com.project.courseweb.services.DashboardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardServiceImpl implements DashboardService {
    
    AuthRepository authRepository;
    CourseRepository courseRepository;
    OrderRepository orderRepository;
    
    @Override
    public DashboardStatsResponse getDashboardStats() {
        log.info("Fetching dashboard statistics");
        
        Long totalUsers = authRepository.count();
        Long totalCourses = courseRepository.countByStatus(com.project.courseweb.enums.CourseStatus.PUBLISHED);
        Long totalOrders = orderRepository.countByStatus(com.project.courseweb.enums.OrderStatus.FULFILLED);
        
        BigDecimal todayRevenue = orderRepository.getTodayRevenue();
        Long todayOrders = orderRepository.getTodayOrderCount();
        
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(12);
        List<Map<String, Object>> monthlyData = orderRepository.getMonthlyOrderStats(twelveMonthsAgo);
        
        List<MonthlyOrderStats> monthlyOrders = new ArrayList<>();
        for (Map<String, Object> data : monthlyData) {
            Integer month = (Integer) data.get("month");
            Long count = ((Number) data.get("totalOrders")).longValue();
            
            String monthName = getMonthName(month);
            monthlyOrders.add(MonthlyOrderStats.builder()
                    .month(monthName)
                    .totalOrders(count)
                    .build());
        }
        
        log.info("Dashboard stats: users={}, courses={}, orders={}, todayRevenue={}, todayOrders={}", 
                totalUsers, totalCourses, totalOrders, todayRevenue, todayOrders);
        
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalOrders(totalOrders)
                .todayRevenue(todayRevenue != null ? todayRevenue.longValue() : 0L)
                .todayOrders(todayOrders)
                .monthlyOrders(monthlyOrders)
                .build();
    }
    
    private String getMonthName(int month) {
        String[] months = {
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", 
            "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
            "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        };
        return months[month - 1];
    }
}
