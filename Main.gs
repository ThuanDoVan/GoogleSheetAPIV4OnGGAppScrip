// ************** Global vars/consts **************

var OPEN_SS_DATA;

var MSG_OBJ_CREATED_OK = "OBJ_CREATED_OK";
var MSG_TBL_CREATED_OK = "TBL_CREATED_OK";
var MSG_OBJ_DATA = "OBJ_DATA";
var MSG_TBL_DATA = "TBL_DATA";
var MSG_TBLS_DATA = "TBLS_DATA";
var MSG_OBJ_UPDT = "OBJ_UPT_OK";
var MSG_OBJ_DEL = "OBJ_DEL_OK";
var MSG_MISS_PARAM = "MISSING_PARAM";
var TYPE_END = "_ENDTYPE";
var TYPE_STRT = "TYPE_";
var MSG_MISS_SEARCH_PARAM = "SEARCH_PARAM_ERR";
var MSG_BAD_PASS = "PASS_ERROR";

var PASSWORD = "SOMEKEYHERE"


// ************** Entry Point **************

var API_GETDATA = "GETDATA";
var API_SAVEDATA = "SAVEDATA";
var APICODE_OK = "OK";
var APICODE_ERROR = "ERROR";

function doPost(e)
{
  return Entry(e);
}

function doGet(e)
{
  return Entry(e);
}

// ************** Initialization functions **************

function Entry(e)
{
  // Password Check.
  if (e.parameters.pass != PASSWORD)
    return ContentService.createTextOutput(MSG_BAD_PASS + e.parameters.pass);
  
   // Useful for service status quick testing.
  if (e.parameters.test != null)
    return ContentService.createTextOutput(JSON.stringify(e));
  
  // Parse the request.
  var result = ParseFlow(e);
  
  // Answer the call.
  var returnValue = ContentService.createTextOutput(result);
  return returnValue;
}

function ParseFlow(e)
{
  var result = "";
  var action = "";
   
  if (e.parameters.action != null)
    action = e.parameters.action.toString();
  else
    return MSG_MISS_PARAM;
  
  switch (action)
  {
    case API_GETDATA:
      result = ParseGetTableData(e);
      break;
      
    case API_SAVEDATA:
      result = ParseWriteTableData(e);
      break;
  }
  
  return result;
}



function ParseGetTableData(e){
  var sheetId = e.parameters.sheed;
  var sheetTabName = e.parameters.tab;
  if(sheetId == null || sheetTabName == null){
    return APICODE_ERROR;
  }else{
    var data =  Sheets.Spreadsheets.Values.get(sheetId.toString(),sheetTabName.toString());
    return JSON.stringify(data.values);
  }
}

function ParseWriteTableData(e){
  var sheetId = e.parameters.sheed;
  var sheetTabName = e.parameters.tab;
  var data = e.parameters.data;
  if(sheetId == null || sheetTabName == null || data == null){
    return APICODE_ERROR;
  }else{
    var valueRange = Sheets.newValueRange();
    valueRange.values = JSON.parse(data);
    var result = Sheets.Spreadsheets.Values.update(valueRange, sheetId.toString(), sheetTabName.toString(), {
    valueInputOption: "USER_ENTERED"
    });
    return APICODE_OK;
  }
}

function TestParserJson(){
  var data = "[[\"A\",\"B\"],[\"C\",\"D\"]]";
  var jsonObj = JSON.parse(data);
  Logger.log(jsonObj);
}

function TestGetJson(){
  var sheetId = "1KE9dCFf1hjS4PdxjM6I2FV4L0R1WRaiFYC9QCMjSkaA";
  var sheetTabName = "Earth2";
  var data =  Sheets.Spreadsheets.Values.get(sheetId.toString(),sheetTabName.toString());
  var returnValue = ContentService.createTextOutput(data.values).getContent();
  Logger.log(returnValue);
}
