package com.ecoclean.collection.dto;

public class BinResponse {
    private String id;
    private String location;
    private String area;
    private Integer fillPercentage;
    private Integer fillLevel;
    private String status;
    private Boolean collectionRequired;

    public BinResponse() {}

    public BinResponse(String id, String location, String area, Integer fillPercentage,
                       Integer fillLevel, String status, Boolean collectionRequired) {
        this.id = id;
        this.location = location;
        this.area = area;
        this.fillPercentage = fillPercentage;
        this.fillLevel = fillLevel != null ? fillLevel : fillPercentage;
        this.status = status;
        this.collectionRequired = collectionRequired;
    }

    public static BinResponseBuilder builder() {
        return new BinResponseBuilder();
    }

    public static class BinResponseBuilder {
        private String id;
        private String location;
        private String area;
        private Integer fillPercentage;
        private Integer fillLevel;
        private String status;
        private Boolean collectionRequired;

        public BinResponseBuilder id(String id) { this.id = id; return this; }
        public BinResponseBuilder location(String location) { this.location = location; return this; }
        public BinResponseBuilder area(String area) { this.area = area; return this; }
        public BinResponseBuilder fillPercentage(Integer fillPercentage) {
            this.fillPercentage = fillPercentage;
            if (this.fillLevel == null) this.fillLevel = fillPercentage;
            return this;
        }
        public BinResponseBuilder fillLevel(Integer fillLevel) { this.fillLevel = fillLevel; return this; }
        public BinResponseBuilder status(String status) { this.status = status; return this; }
        public BinResponseBuilder collectionRequired(Boolean collectionRequired) { this.collectionRequired = collectionRequired; return this; }

        public BinResponse build() {
            return new BinResponse(id, location, area, fillPercentage,
                    fillLevel != null ? fillLevel : fillPercentage, status, collectionRequired);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Integer getFillPercentage() { return fillPercentage; }
    public void setFillPercentage(Integer fillPercentage) {
        this.fillPercentage = fillPercentage;
        if (this.fillLevel == null) this.fillLevel = fillPercentage;
    }
    public Integer getFillLevel() { return fillLevel != null ? fillLevel : fillPercentage; }
    public void setFillLevel(Integer fillLevel) { this.fillLevel = fillLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getCollectionRequired() { return collectionRequired; }
    public void setCollectionRequired(Boolean collectionRequired) { this.collectionRequired = collectionRequired; }
}
