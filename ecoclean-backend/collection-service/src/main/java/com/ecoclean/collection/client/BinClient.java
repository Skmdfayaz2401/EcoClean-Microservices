package com.ecoclean.collection.client;

import com.ecoclean.collection.dto.BinResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "BIN-MONITORING-SERVICE", fallback = BinClientFallback.class)
public interface BinClient {
    @GetMapping("/api/bins/{id}")
    BinResponse getBinById(@PathVariable("id") String id);

    @PutMapping("/api/bins/{id}/reset-after-collection")
    BinResponse resetAfterCollection(@PathVariable("id") String id);
}

@Component
class BinClientFallback implements BinClient {
    @Override
    public BinResponse getBinById(String id) {
        return BinResponse.builder().id(id).location("Municipal Sector").fillPercentage(90).status("Critical").build();
    }

    @Override
    public BinResponse resetAfterCollection(String id) {
        System.out.println("[BinClientFallback] Reset bin after collection for " + id);
        return BinResponse.builder().id(id).fillPercentage(10).status("Normal").collectionRequired(false).build();
    }
}
