package com.ecoclean.route.repository;

import com.ecoclean.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
    List<Route> findByDriverId(String driverId);
    List<Route> findByStatus(String status);
}
