package com.ecoclean.collection.repository;

import com.ecoclean.collection.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, String> {
    List<Collection> findByStatus(String status);
    List<Collection> findByAssignedDriverId(String assignedDriverId);
    List<Collection> findByBinId(String binId);
}
