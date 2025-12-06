package com.project.courseweb.repositories;

import com.project.courseweb.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderRef(String vnpTxnRef);
    
    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE AND o.status = 'FULFILLED'")
    BigDecimal getTodayRevenue();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE AND o.status = 'FULFILLED'")
    Long getTodayOrderCount();
    
    @Query(value = "SELECT MONTH(created_at) as month, COUNT(*) as totalOrders " +
                   "FROM orders WHERE created_at >= :startDate AND status = 'FULFILLED' " +
                   "GROUP BY MONTH(created_at) ORDER BY MONTH(created_at)", 
           nativeQuery = true)
    List<Map<String, Object>> getMonthlyOrderStats(@Param("startDate") LocalDateTime startDate);
    
    long countByStatus(com.project.courseweb.enums.OrderStatus status);
}
