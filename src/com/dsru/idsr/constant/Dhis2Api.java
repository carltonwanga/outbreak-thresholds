package com.dsru.idsr.constant;

public class Dhis2Api {

    public static final String ROOT_API_URL = "https://hiskenya.org/api/26/";
    public static final String KENYA_COUNTIES_LIST_URL = ROOT_API_URL+"organisationUnits/HfVjCurKxh2.json?fields=children%5Bid,displayName~rename(name)%5D&paging=false";
    public static final String ORG_UNIT_LIST_URL = ROOT_API_URL+"organisationUnits/";
    public static final String SUB_COUNTY_WEEKLY_MALARIA_URL = ROOT_API_URL+"analytics/dataValueSet.json?displayProperty=NAME&dimension=dx:GJDppyWOYYM&dimension=ou:USER_ORGUNIT_GRANDCHILDREN";
    public static final String SUB_COUNTY_WEEKLY_MENINGITIS_URL = ROOT_API_URL+"analytics/dataValueSet.json?displayProperty=NAME&dimension=dx:IVT5avXg4CC&dimension=ou:USER_ORGUNIT_GRANDCHILDREN";
    public static final String SUB_COUNTY_WEEK_MALARIA_INDICATORS_BASE_URL = ROOT_API_URL+"analytics/dataValueSet.json?dimension=ou:USER_ORGUNIT_GRANDCHILDREN&displayProperty=NAME";
    public static final int DHIS2_START_YEAR = 2016;


}
