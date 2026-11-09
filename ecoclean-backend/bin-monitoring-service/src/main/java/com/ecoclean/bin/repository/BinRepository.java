package com.ecoclean.bin.repository;

import com.ecoclean.bin.entity.Bin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BinRepository extends JpaRepository<Bin, String> {
    List<Bin> findByStatus(String status);
    List<Bin> findByCollectionRequired(Boolean collectionRequired);
    List<Bin> findByArea(String area);
}
