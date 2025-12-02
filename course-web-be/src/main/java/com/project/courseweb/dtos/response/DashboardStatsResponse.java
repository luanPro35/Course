package com.project.courseweb.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardStatsResponse {
    Long totalUsers;
    Long totalCourses;
    Long totalOrders;
    Long todayRevenue;
    Long todayOrders;
    List<MonthlyOrderStats> monthlyOrders;
}
