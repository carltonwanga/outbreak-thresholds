package com.dsru.idsr.model;

import java.util.Date;

public class Moh505ImportItem {
    String disease;
    String subCounty;
    int week;
    Date weekEnding;
    Long casesLessThan5;
    Long casesGreaterThan5;
    Long deathsLessThan5;
    Long deathsGreaterThan5;
    int year;
    Date dateReported;

    public Moh505ImportItem(String disease, String subCounty, int week, Date weekEnding, Long casesLessThan5, Long casesGreaterThan5, Long deathsLessThan5, Long deathsGreaterThan5, int year, Date dateReported) {
        this.disease = disease;
        this.subCounty = subCounty;
        this.week = week;
        this.weekEnding = weekEnding;
        this.casesLessThan5 = casesLessThan5;
        this.casesGreaterThan5 = casesGreaterThan5;
        this.deathsLessThan5 = deathsLessThan5;
        this.deathsGreaterThan5 = deathsGreaterThan5;
        this.year = year;
        this.dateReported = dateReported;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getSubCounty() {
        return subCounty;
    }

    public void setSubCounty(String subCounty) {
        this.subCounty = subCounty;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public Date getWeekEnding() {
        return weekEnding;
    }

    public void setWeekEnding(Date weekEnding) {
        this.weekEnding = weekEnding;
    }

    public Long getCasesLessThan5() {
        return casesLessThan5;
    }

    public void setCasesLessThan5(Long casesLessThan5) {
        this.casesLessThan5 = casesLessThan5;
    }

    public Long getCasesGreaterThan5() {
        return casesGreaterThan5;
    }

    public void setCasesGreaterThan5(Long casesGreaterThan5) {
        this.casesGreaterThan5 = casesGreaterThan5;
    }

    public Long getDeathsLessThan5() {
        return deathsLessThan5;
    }

    public void setDeathsLessThan5(Long deathsLessThan5) {
        this.deathsLessThan5 = deathsLessThan5;
    }

    public Long getDeathsGreaterThan5() {
        return deathsGreaterThan5;
    }

    public void setDeathsGreaterThan5(Long deathsGreaterThan5) {
        this.deathsGreaterThan5 = deathsGreaterThan5;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public Date getDateReported() {
        return dateReported;
    }

    public void setDateReported(Date dateReported) {
        this.dateReported = dateReported;
    }

}
