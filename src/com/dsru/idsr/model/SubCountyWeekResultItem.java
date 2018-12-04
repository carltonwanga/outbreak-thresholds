package com.dsru.idsr.model;

public class SubCountyWeekResultItem {
    String dataElement;
    String period;
    String subCounty;
    int value;
    int week;
    int year;

    public SubCountyWeekResultItem(String dataElement, String period, String subCounty, int value, int week, int year) {
        this.dataElement = dataElement;
        this.period = period;
        this.subCounty = subCounty;
        this.value = value;
        this.week = week;
        this.year = year;
    }

    public String getDataElement() {
        return dataElement;
    }

    public void setDataElement(String dataElement) {
        this.dataElement = dataElement;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getSubCounty() {
        return subCounty;
    }

    public void setSubCounty(String subCounty) {
        this.subCounty = subCounty;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
