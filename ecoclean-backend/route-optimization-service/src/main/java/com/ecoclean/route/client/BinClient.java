package com.ecoclean.route.client;

import com.ecoclean.route.dto.BinDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Collections;
import java.util.List;

@FeignClient(name = "BIN-MONITORING-SERVICE", fallback = BinClientFallback.class)
public interface BinClient {
    @GetMapping("/api/bins")
    List<BinDto> getAllBins();

    @GetMapping("/api/bins/{id}")
    BinDto getBinById(@PathVariable("id") String id);
}

@Component
class BinClientFallback implements BinClient {
    @Override
    public List<BinDto> getAllBins() {
        return Collections.emptyList();
    }

    @Override
    public BinDto getBinById(String id) {
        return BinDto.builder().id(id).location("Main Street").latitude(40.7128).longitude(-74.0060).fillPercentage(85).build();
    }
}
