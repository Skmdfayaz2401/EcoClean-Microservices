package com.ecoclean.bin.dto;

public class BinStatistics {
    private long totalBins;
    private long criticalBins;
    private long highBins;
    private long mediumBins;
    private long normalBins;
    private long emptyBins;
    private long collectionRequiredBins;
    private double averageFillLevel;

    public BinStatistics() {}

    public BinStatistics(long totalBins, long criticalBins, long highBins, long mediumBins,
                         long normalBins, long emptyBins, long collectionRequiredBins, double averageFillLevel) {
        this.totalBins = totalBins;
        this.criticalBins = criticalBins;
        this.highBins = highBins;
        this.mediumBins = mediumBins;
        this.normalBins = normalBins;
        this.emptyBins = emptyBins;
        this.collectionRequiredBins = collectionRequiredBins;
        this.averageFillLevel = averageFillLevel;
    }

    public static BinStatisticsBuilder builder() {
        return new BinStatisticsBuilder();
    }

    public static class BinStatisticsBuilder {
        private long totalBins;
        private long criticalBins;
        private long highBins;
        private long mediumBins;
        private long normalBins;
        private long emptyBins;
        private long collectionRequiredBins;
        private double averageFillLevel;

        public BinStatisticsBuilder totalBins(long totalBins) { this.totalBins = totalBins; return this; }
        public BinStatisticsBuilder criticalBins(long criticalBins) { this.criticalBins = criticalBins; return this; }
        public BinStatisticsBuilder highBins(long highBins) { this.highBins = highBins; return this; }
        public BinStatisticsBuilder mediumBins(long mediumBins) { this.mediumBins = mediumBins; return this; }
        public BinStatisticsBuilder normalBins(long normalBins) { this.normalBins = normalBins; return this; }
        public BinStatisticsBuilder emptyBins(long emptyBins) { this.emptyBins = emptyBins; return this; }
        public BinStatisticsBuilder collectionRequiredBins(long collectionRequiredBins) { this.collectionRequiredBins = collectionRequiredBins; return this; }
        public BinStatisticsBuilder averageFillLevel(double averageFillLevel) { this.averageFillLevel = averageFillLevel; return this; }

        public BinStatistics build() {
            return new BinStatistics(totalBins, criticalBins, highBins, mediumBins, normalBins, emptyBins, collectionRequiredBins, averageFillLevel);
        }
    }

    public long getTotalBins() { return totalBins; }
    public void setTotalBins(long totalBins) { this.totalBins = totalBins; }
    public long getCriticalBins() { return criticalBins; }
    public void setCriticalBins(long criticalBins) { this.criticalBins = criticalBins; }
    public long getHighBins() { return highBins; }
    public void setHighBins(long highBins) { this.highBins = highBins; }
    public long getMediumBins() { return mediumBins; }
    public void setMediumBins(long mediumBins) { this.mediumBins = mediumBins; }
    public long getNormalBins() { return normalBins; }
    public void setNormalBins(long normalBins) { this.normalBins = normalBins; }
    public long getEmptyBins() { return emptyBins; }
    public void setEmptyBins(long emptyBins) { this.emptyBins = emptyBins; }
    public long getCollectionRequiredBins() { return collectionRequiredBins; }
    public void setCollectionRequiredBins(long collectionRequiredBins) { this.collectionRequiredBins = collectionRequiredBins; }
    public double getAverageFillLevel() { return averageFillLevel; }
    public void setAverageFillLevel(double averageFillLevel) { this.averageFillLevel = averageFillLevel; }
}
