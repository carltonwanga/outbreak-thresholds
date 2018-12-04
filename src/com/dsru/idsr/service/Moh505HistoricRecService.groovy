package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.model.Moh505ImportItem
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.DateUtil
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

import java.text.SimpleDateFormat


@Service
class Moh505HistoricRecService {

    public String importHistoricData(def parameterMap,MultipartFile file) {
        Map configParams = CommonUtils.flattenListParam(parameterMap);
        FileInputStream excelFile = file.getInputStream();

        Map res = [status:0,success:true,"message":"Could not import data. Please Check the format"];

        Workbook workbook = new XSSFWorkbook(excelFile);
        int sheetNumber = Integer.parseInt(configParams.get("sheetnumber"))-1;
        XSSFSheet dataSheet = workbook.getSheetAt(sheetNumber);

        int rowNum = dataSheet.size();
        if(rowNum){
            DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
            Sql sql = new Sql(dataSource);
            def batchDetails = sql.executeInsert("INSERT INTO moh_505_import_batch_operations(time_imported) VALUES (current_timestamp)");
            long batchId = batchDetails.get(0).get(0);

            int batchErrors = 0;
            List diseaseMapping  = sql.rows("SELECT * FROM disease_mapping");

            int startIndex = configParams.get("title_column" ) =="on"?1:0;
            List importItems = [];
            for(int i = startIndex;i<rowNum;i++){
                Row currentRow = dataSheet.getRow(i);
                int diseaseColumnPosition = Integer.parseInt(configParams.get("disease"))-1;

                String importedDisease = currentRow.getCell(diseaseColumnPosition).getStringCellValue();
                if(importedDisease){
                    String diseaseCode = "";
                    def currentDiseaseMap = diseaseMapping.find {
                        return (importedDisease.trim().replaceAll("\\s+","").equalsIgnoreCase(it.get("disease_name").replaceAll("\\s+","")));
                    }
                    if(currentDiseaseMap){
                        diseaseCode = currentDiseaseMap.get("dhis2_code");

                        int subCountyColumnPosition = Integer.parseInt(configParams.get("subcounty"))-1;
                        String currentSubCounty = currentRow.getCell(subCountyColumnPosition)?.getStringCellValue();
                        if(currentSubCounty){
                            def currentSubCountyMapping = sql.firstRow("SELECT * FROM sub_county WHERE regexp_replace(name, '\\s', '', 'g') ILIKE regexp_replace(?, '\\s', '', 'g')||'%'",currentSubCounty);
                            String subCountyCode = "";
                            if(currentSubCountyMapping){
                                subCountyCode = currentSubCountyMapping.get("dhis2_code");

                                //Get week column data
                                int weekNumberColumnPosition = Integer.parseInt(configParams.get("week"))-1;
                                XSSFCell weekCell = currentRow.getCell(weekNumberColumnPosition);
                                if(weekCell.getCellTypeEnum() == CellType.NUMERIC){
                                    int currentWeek = weekCell.getNumericCellValue();

                                    Date weekEnding = null;
                                    //Get week ending column data
                                    if(configParams.get("weekending").toString().isInteger()){

                                        int weekEndingColumnPosition = Integer.parseInt(configParams.get("weekending"))-1;
                                        XSSFCell weekEndingCell = currentRow.getCell(weekEndingColumnPosition);
                                        if(weekEndingCell.getCellTypeEnum() == CellType.NUMERIC){
                                            weekEnding = DateUtil.getJavaDate((double) weekEndingCell.getNumericCellValue());

                                        }else{
                                            batchErrors++;
                                            String errorNarration = "Invalid date in row ${i+1}, column ${weekEndingColumnPosition+1}".toString();
                                            Map errorParams = [row:i+1,column:weekEndingColumnPosition+1,errorCode:4,narration:errorNarration,batchId:batchId];
                                            sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                        }

                                    }

                                    //Get cases less than 5 column data
                                    int casesLess5ColumnPosition = Integer.parseInt(configParams.get("cases_less_5"))-1;
                                    XSSFCell casesLess5Cell = currentRow.getCell(casesLess5ColumnPosition);
                                    if(casesLess5Cell.getCellTypeEnum() == CellType.NUMERIC){
                                        int casesLess5 = casesLess5Cell.getNumericCellValue();

                                        //Get cases greater than 5 column data
                                        int casesGreater5ColumnPosition = Integer.parseInt(configParams.get("cases_greater_5"))-1;
                                        XSSFCell casesGreater5Cell = currentRow.getCell(casesGreater5ColumnPosition);
                                        if(casesGreater5Cell.getCellTypeEnum() == CellType.NUMERIC){
                                            int casesGreater5 = casesGreater5Cell.getNumericCellValue();

                                            //Get deaths less than 5 column data
                                            int deathsLess5ColumnPosition = Integer.parseInt(configParams.get("deaths_less_5"))-1;
                                            XSSFCell deathsLess5Cell = currentRow.getCell(deathsLess5ColumnPosition);



                                            if(deathsLess5Cell.getCellTypeEnum() == CellType.NUMERIC){
                                                int deathsLess5 = deathsLess5Cell.getNumericCellValue();

                                                //Get deaths greater than 5 column data
                                                int deathsGreater5ColumnPosition = Integer.parseInt(configParams.get("deaths_greater_5"))-1;
                                                XSSFCell deathsGreater5Cell = currentRow.getCell(deathsGreater5ColumnPosition);
                                                if(deathsGreater5Cell.getCellTypeEnum() == CellType.NUMERIC){
                                                    int deathsGreater5 = deathsGreater5Cell.getNumericCellValue();

                                                    //Get year column data
                                                    int yearColumnPosition = Integer.parseInt(configParams.get("year"))-1;
                                                    XSSFCell yearCell = currentRow.getCell(yearColumnPosition);
                                                    if(yearCell.getCellTypeEnum() == CellType.NUMERIC){
                                                        int year = yearCell.getNumericCellValue();

                                                        //Get date reported column position
                                                        Date dateReported = null;
                                                        if(configParams.get("date_reported")){

                                                            int dateReportedColumnPosition = Integer.parseInt(configParams.get("date_reported"))-1;
                                                            XSSFCell dateReportedCell = currentRow.getCell(dateReportedColumnPosition);
                                                            if(dateReportedCell.getCellTypeEnum() == CellType.NUMERIC){
                                                                dateReported = DateUtil.getJavaDate((double) dateReportedCell.getNumericCellValue());

                                                            }else if(dateReportedCell.getCellTypeEnum() == CellType.STRING){
                                                                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                                                                dateReported = sdf.parse(dateReportedCell.getStringCellValue());

                                                            }else{
                                                                batchErrors++;
                                                                String errorNarration = "Invalid date in row ${i+1}, column ${dateReportedColumnPosition+1}".toString();
                                                                Map errorParams = [row:i+1,column:dateReportedColumnPosition+1,errorCode:10,narration:errorNarration,batchId:batchId];
                                                                sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);
                                                            }

                                                        }

                                                        Moh505ImportItem moh505ImportItem = new Moh505ImportItem(diseaseCode,subCountyCode,currentWeek,weekEnding,casesLess5,casesGreater5,deathsLess5,deathsGreater5,year,dateReported);
                                                        importItems.add(moh505ImportItem);

                                                    }else{
                                                        batchErrors++;
                                                        String errorNarration = "Invalid year in row ${i+1}, column ${yearColumnPosition+1}".toString();
                                                        Map errorParams = [row:i+1,column:yearColumnPosition+1,errorCode:9,narration:errorNarration,batchId:batchId];
                                                        sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                                    }


                                                }else{
                                                    batchErrors++;
                                                    String errorNarration = "Invalid deaths greater than 5 in row ${i+1}, column ${deathsGreater5ColumnPosition+1}".toString();
                                                    Map errorParams = [row:i+1,column:deathsGreater5ColumnPosition+1,errorCode:8,narration:errorNarration,batchId:batchId];
                                                    sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                                }


                                            }else{
                                                batchErrors++;
                                                String errorNarration = "Invalid deaths less than 5 in row ${i+1}, column ${deathsLess5ColumnPosition+1}".toString();
                                                Map errorParams = [row:i+1,column:deathsLess5ColumnPosition+1,errorCode:7,narration:errorNarration,batchId:batchId];
                                                sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                            }

                                        }else{
                                            batchErrors++;
                                            String errorNarration = "Invalid cases greater than 5 in row ${i+1}, column ${casesGreater5ColumnPosition+1}".toString();
                                            Map errorParams = [row:i+1,column:casesGreater5ColumnPosition+1,errorCode:6,narration:errorNarration,batchId:batchId];
                                            sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                        }



                                    }else{
                                        batchErrors++;
                                        String errorNarration = "Invalid cases less than 5 in row ${i+1}, column ${casesLess5ColumnPosition+1}".toString();
                                        Map errorParams = [row:i+1,column:casesLess5ColumnPosition+1,errorCode:5,narration:errorNarration,batchId:batchId];
                                        sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                                    }

                                }else{
                                    batchErrors++;
                                    String errorNarration = "Invalid or blank week in row ${i+1}, column ${weekNumberColumnPosition+1}".toString();
                                    Map errorParams = [row:i+1,column:weekNumberColumnPosition+1,errorCode:3,narration:errorNarration,batchId:batchId];
                                    sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);


                                }
                            }else{
                                batchErrors++;
                                String errorNarration = "Could not find sub county mapping for ${currentSubCounty}, row ${i+1} , column ${subCountyColumnPosition+1}".toString();
                                Map errorParams = [row:i+1,column:subCountyColumnPosition+1,errorCode:2,narration:errorNarration,batchId:batchId];
                                sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);

                            }
                        }else{
                            batchErrors++;
                            String errorNarration = "Invalid or blank subcounty in row ${i+1} , column ${subCountyColumnPosition+1}".toString();
                            Map errorParams = [row:i+1,column:subCountyColumnPosition+1,errorCode:2,narration:errorNarration,batchId:batchId];
                            sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);


                        }


                    }else {
                        batchErrors++;
                        String errorNarration = "Could not find disease mapping for ${importedDisease}, row ${i+1} , column ${diseaseColumnPosition+1}".toString();

                        Map errorParams = [row:i+1,column:diseaseColumnPosition+1,errorCode:1,narration:errorNarration,batchId:batchId];
                        sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);
                    }


                }else{
                    batchErrors++;
                    String errorNarration = "Invalid or blank disease at row ${i+1} , column ${diseaseColumnPosition+1}".toString();

                    Map errorParams = [row:i+1,column:diseaseColumnPosition+1,errorCode:1,narration:errorNarration,batchId:batchId];
                    sql.executeInsert("INSERT INTO moh_505_import_errors(row_number, column_number, error_code, narration, batch_id) VALUES (?.row,?.column,?.errorCode,?.narration,?.batchId)",errorParams);


                }
            }

            sql.executeUpdate("UPDATE moh_505_import_batch_operations SET total_errors = $batchErrors");
            sql.close();
            boolean importStatus = updateImportRecords(importItems,batchId);

            if(importStatus){
                res.put("status",1);
                res.put("message","Data importation successful");
                res.put("data",batchId);
            }

        }else{
            res.put("message","Could not import data. No records found");
        }

        return JsonOutput.toJson(res)
    }

    public boolean updateImportRecords(List<Moh505ImportItem> moh505ImportItems,long batchId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        boolean status = false;
        int totalInserted = 0;
        int totalUpdated = 0;

        sql.withTransaction {
            sql.withBatch { stmt ->
                moh505ImportItems.each {
                    Moh505ImportItem moh505ImportItem = it;
                    //Check if week-sub-county disease record exists
                    def existingRecord = sql.firstRow("SELECT * FROM moh_505_historic_data WHERE sub_county_code = ?.subCounty AND disease_code = ?.disease AND week = ?.week AND year = ?.year",moh505ImportItem);

                    if(existingRecord){
                        //Check if record needs updating
                        if(!(existingRecord.get("cases_less_than_5") == moh505ImportItem.getCasesLessThan5()&& existingRecord.get("cases_greater_than_5") == moh505ImportItem.getCasesGreaterThan5()&& existingRecord.get("deaths_less_than_5") == moh505ImportItem.getDeathsLessThan5()&& existingRecord.get("deaths_greater_than_5") == moh505ImportItem.getDeathsGreaterThan5())){
                             def query = "UPDATE moh_505_historic_data SET cases_less_than_5 = ${moh505ImportItem.casesLessThan5},cases_greater_than_5 = ${moh505ImportItem.casesGreaterThan5},deaths_less_than_5 = ${moh505ImportItem.deathsLessThan5},deaths_greater_than_5 = ${moh505ImportItem.deathsGreaterThan5} WHERE id = ${existingRecord.id}";
                             stmt.addBatch(query);
                             totalUpdated++;
                        }

                    }else{
                        String itemDateReported = moh505ImportItem.dateReported?"date('${moh505ImportItem.dateReported}')":"NULL";
                        String itemWeekEnding = moh505ImportItem.weekEnding?"date('${moh505ImportItem.weekEnding}')":"NULL";
                        def query = """INSERT INTO moh_505_historic_data(disease_code, sub_county_code, week, year, cases_less_than_5, cases_greater_than_5, deaths_less_than_5, deaths_greater_than_5, date_reported, week_ending_date, import_batch_id) 
                                                                        VALUES ('${moh505ImportItem.disease}','${moh505ImportItem.subCounty}',${moh505ImportItem.week},${moh505ImportItem.year},${moh505ImportItem.casesLessThan5},${moh505ImportItem.casesGreaterThan5},${moh505ImportItem.deathsLessThan5},${moh505ImportItem.deathsGreaterThan5},$itemDateReported,$itemWeekEnding,${batchId})""";
                        stmt.addBatch(query);
                        totalInserted++;
                    }
                }
                stmt.executeBatch();

            }
            status = true;
            sql.executeUpdate("UPDATE moh_505_import_batch_operations SET total_inserted = $totalInserted, total_updated = $totalUpdated WHERE id = $batchId");



        }

        sql.close();
        return status;
    }

    public String fetchHistoricRecords(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def countParamStatus = false;

        def filterQuery = "";

        if(params.county){
            filterQuery+=" AND county.dhis2_code = '${params.county}' ";
        }

        if(params.subcounty){
            filterQuery+=" AND moh_505_historic_data.sub_county_code = '${params.subcounty}' ";

        }

        if(params.week){
            filterQuery+=" AND moh_505_historic_data.week = ${params.week} ";

        }

        if(params.year){
            filterQuery+=" AND moh_505_historic_data.year = ${params.year} ";

        }

        def sqlParams = [start: start, limit: limit];

        def queryStr  = """SELECT
        "public".moh_505_historic_data."id",
        "public".moh_505_historic_data.disease_code,
        "public".moh_505_historic_data.sub_county_code,
        "public".moh_505_historic_data.week,
        "public".moh_505_historic_data."year",
        "public".moh_505_historic_data.cases_less_than_5,
        "public".moh_505_historic_data.cases_greater_than_5,
        "public".moh_505_historic_data.deaths_less_than_5,
        "public".moh_505_historic_data.deaths_greater_than_5,
        "public".moh_505_historic_data.date_reported,
        "public".moh_505_historic_data.week_ending_date,
        "public".moh_505_historic_data.import_batch_id,
        "public".sub_county."name" AS sub_county,
        "public".county."name" AS county,
        "public".disease_mapping.disease_name
        FROM
        "public".moh_505_historic_data,
        "public".sub_county,
        "public".county,
        "public".disease_mapping 
        WHERE
        "public".moh_505_historic_data.sub_county_code = "public".sub_county.dhis2_code AND
        "public".sub_county.county_code = "public".county.dhis2_code AND
        "public".moh_505_historic_data.disease_code = "public".disease_mapping.dhis2_code """+
        filterQuery+
        """ LIMIT ?.limit OFFSET ?.start""";

        def countStr = """SELECT COUNT(1) FROM
                        "public".moh_505_historic_data,
                        "public".sub_county,
                        "public".county,
                        "public".disease_mapping 
                         WHERE
                        "public".moh_505_historic_data.sub_county_code = "public".sub_county.dhis2_code AND
                        "public".sub_county.county_code = "public".county.dhis2_code AND
                        "public".moh_505_historic_data.disease_code = "public".disease_mapping.dhis2_code """+
                         filterQuery;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public String fetchBatchImports(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def query = params.query?.toInteger();

        def countParamStatus = false;
        def filterStr = "";

        if(query){
            filterStr = " WHERE id = ?.batchId ";
            countParamStatus = true;
        }
        def sqlParams = [start: start, limit: limit, batchId: query];

        def queryStr  = "SELECT * FROM moh_505_import_batch_operations"+filterStr+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM moh_505_import_batch_operations "+filterStr;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public String fetchBatchErrors(def parameterMap,long batchId){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def countParamStatus = true;

        def sqlParams = [start: start, limit: limit,batchId: batchId];

        def queryStr  = """SELECT * FROM moh_505_import_errors WHERE batch_id = ?.batchId LIMIT ?.limit OFFSET ?.start""";
        def countStr = "SELECT COUNT(1) FROM moh_505_import_errors WHERE batch_id = ?.batchId";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }


}
