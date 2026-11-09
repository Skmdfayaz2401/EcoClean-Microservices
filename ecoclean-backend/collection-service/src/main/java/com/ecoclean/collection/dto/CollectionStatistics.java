package com.ecoclean.collection.dto;

public class CollectionStatistics {
    private long totalCollections;
    private long pendingCollections;
    private long assignedCollections;
    private long inProgressCollections;
    private long completedCollections;
    private long cancelledCollections;

    public CollectionStatistics() {}

    public CollectionStatistics(long totalCollections, long pendingCollections, long assignedCollections,
                                long inProgressCollections, long completedCollections, long cancelledCollections) {
        this.totalCollections = totalCollections;
        this.pendingCollections = pendingCollections;
        this.assignedCollections = assignedCollections;
        this.inProgressCollections = inProgressCollections;
        this.completedCollections = completedCollections;
        this.cancelledCollections = cancelledCollections;
    }

    public static CollectionStatisticsBuilder builder() {
        return new CollectionStatisticsBuilder();
    }

    public static class CollectionStatisticsBuilder {
        private long totalCollections;
        private long pendingCollections;
        private long assignedCollections;
        private long inProgressCollections;
        private long completedCollections;
        private long cancelledCollections;

        public CollectionStatisticsBuilder totalCollections(long totalCollections) { this.totalCollections = totalCollections; return this; }
        public CollectionStatisticsBuilder pendingCollections(long pendingCollections) { this.pendingCollections = pendingCollections; return this; }
        public CollectionStatisticsBuilder assignedCollections(long assignedCollections) { this.assignedCollections = assignedCollections; return this; }
        public CollectionStatisticsBuilder inProgressCollections(long inProgressCollections) { this.inProgressCollections = inProgressCollections; return this; }
        public CollectionStatisticsBuilder completedCollections(long completedCollections) { this.completedCollections = completedCollections; return this; }
        public CollectionStatisticsBuilder cancelledCollections(long cancelledCollections) { this.cancelledCollections = cancelledCollections; return this; }

        public CollectionStatistics build() {
            return new CollectionStatistics(totalCollections, pendingCollections, assignedCollections, inProgressCollections, completedCollections, cancelledCollections);
        }
    }

    public long getTotalCollections() { return totalCollections; }
    public void setTotalCollections(long totalCollections) { this.totalCollections = totalCollections; }
    public long getPendingCollections() { return pendingCollections; }
    public void setPendingCollections(long pendingCollections) { this.pendingCollections = pendingCollections; }
    public long getAssignedCollections() { return assignedCollections; }
    public void setAssignedCollections(long assignedCollections) { this.assignedCollections = assignedCollections; }
    public long getInProgressCollections() { return inProgressCollections; }
    public void setInProgressCollections(long inProgressCollections) { this.inProgressCollections = inProgressCollections; }
    public long getCompletedCollections() { return completedCollections; }
    public void setCompletedCollections(long completedCollections) { this.completedCollections = completedCollections; }
    public long getCancelledCollections() { return cancelledCollections; }
    public void setCancelledCollections(long cancelledCollections) { this.cancelledCollections = cancelledCollections; }
}
