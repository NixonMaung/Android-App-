var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {    document.addEventListener('deviceready', this.onDeviceReady, false);  },
    onDeviceReady: function() {
    onBodyLoad();
  },
};
var db;
var shortName = 'WebSqlDB';// database short name is web sql db
var version = '1.0';// database version 1. 0
var displayName = 'WebSqlDB'; // database display name is web sql db
var maxSize = 65535; // database max size is 65535
function errorHandler(transaction, error) { alert('Error: ' + error.message + ' code: ' + error.code);}// this is called when an error happens in a transaction
function successCallBack(){}// this is called when a successful transaction happens
function nullHandler() {}

//create database and call list DB value to display all data from datbase.
function onBodyLoad() {
if (!window.openDatabase) {alert('Databases are not supported in this browser.');return;}
  // open the database base locally on the device
  db = openDatabase(shortName, version, displayName,maxSize);
  db.transaction(function(tx){
  //creates the table and sets up the eight columns and their types <!--  (Java et al., 2017)   -->
  tx.executeSql( 'CREATE TABLE IF NOT EXISTS myFood(MealId INTEGER NOT NULL PRIMARY KEY, FoodName TEXT NOT NULL, FoodGroup TEXT NOT NULL, MealType TEXT NOT NULL, Time TEXT NOT NULL, Date TEXT NOT NULL, Note TEXT NOT NULL, Reporter TEXT NOT NULL, FoodRanking TEXT NOT NULL, PortionSize TEXT NOT NULL, Calories TEXT NOT NULL, Description TEXT NOT NULL, Image BLOB)',
  [], nullHandler, errorHandler);}, errorHandler, successCallBack);
  ListDBValues();// display all data from database
  nameCheck(); // every time when food name edit text is kwy up.
}
//select all data from the database and list them on main page.

function ListDBValues() {
  db.transaction(function(transaction) {// sqlite query select all from my food table
    transaction.executeSql('SELECT * FROM myFood ORDER BY MealId DESC;',  [],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {//read the data if database is not empty.
        // creating arrays days and month names for clean the raw data, to be able show the  nice format.
         var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
         //array that hold the all 12 months name
         var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October","November", "December" ];
         //making shorter name so that it can be call and used easily
         var group =   document.getElementById("dwFoodGroups");
         var date =   document.getElementById("dwDate");
         var reporter =   document.getElementById("dwReporter");
        // loop will add dynamically data into the list view.<!-- (loops, 2013)    -->
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var d = new Date(row.Date);// creating the date in variable
            // creating proper image source, row.image 64 letters which is blob change into image src.
            var src="data:image/png;base64,"+ row.Image;
            document.getElementById("txImage").value = row.Image;// store the image
            if (row.Image == 'undefined' )// any record that have no image then the display the default image.<!--  (JavaScript/HTML/SQLite), 2013)   -->
            { var src="Image/Unknown.jpg"; }// select the default image from image folder
            var day = d.getDate() + 1 ;// add one extra day to record while reading from database
            // adding to list view, creating the format<!-- (form, 2013) -->
            $('#myNewListView').append('<br><li data-role="list-divider">'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+day  +', '+d.getFullYear()+' <span class="ui-li-count">'+row.Time+'</span></li><li><a onclick="myFunction(\''+
            row.MealId + '\',\'' +  row.FoodName + '\',\'' +  row.FoodGroup + '\',\''+  row.Time  + '\',\'' +   row.Date + '\',\'' +   row.MealType + '\',\'' +   row.Note + '\',\'' +   row.FoodRanking + '\',\'' +   row.PortionSize + '\',\'' +   row.Calories + '\',\''  +   row.Description + '\',\'' +  row.Reporter+
            '\');" href="#popupMainMenu" data-rel="popup" data-transition="slide" class="ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-bullets ui-btn-icon-right ui-btn-inline ui-mini">'+
            ' <table width="100%"><tr><td><img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" ></td><td><h2 style="font-size:16px; text-align:left;">' +row.FoodName +'</h2></p><strong style="font-size:12px;"> '+' Category: '+row.FoodGroup+ ' added by '+ row.Reporter +'. </strong></p> <p class="ui-li-aside"><strong style="font-size:12px;">'+row.Calories+'Cal (g)</strong></p></td></tr></table></a></li>');
            $('#myNewListView').listview('refresh');// refresh the list view data

            //Load all the drop down list from database
            // load and add all food group result to filter dropdown list called dwFoodGroup from database while reading from database
            $('#dwFoodGroups').append('<option value='+row.FoodGroup+'>'+ row.FoodGroup+'</option>');
            // load and add all food name result to filter dropdown list called dwFoodName from database while reading from database
            $('#dwFoodName').append('<option value='+row.FoodName+'>'+ row.FoodName+'</option>');
            // load and add all date result to filter dropdown list called dwDate from database while reading from database
            $('#dwDate').append('<option value='+row.Date+'>'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+d.getDate() +', '+d.getFullYear()+'</option>');
            // load and add all reporter name result to filter dropdown list called dwFoodGroup from database while reading from database
            $('#dwReporter').append('<option >'+ row.Reporter+'</option>');
            //clear duplicate value from drop down which was load from database
           [].slice.call(group.options).map(function(a){if(this[a.value]){
           group.removeChild(a);} else {this[a.value]=1;}},{});
           [].slice.call(date.options).map(function(a){if(this[a.value]){
           date.removeChild(a);} else {this[a.value]=1;}},{});
           [].slice.call(reporter.options).map(function(a){if(this[a.value]){
           reporter.removeChild(a);} else {this[a.value]=1;}},{});
             }
      }
    }, errorHandler);
  }, errorHandler, nullHandler);

      $('#txCalories').val($('#txCaloriesNumber').val());// load the calories.
      $('#txCalories').slider('refresh');// refresh the range bar every time page is load for new record
      return;
}

//read and display the specific data when user is clicks from the list view at the home page
// once user is clicks one of the
//<!--  (function, 2012)   -->
function myFunction(mealId, foodName, foodGroup, time, date, mealType, note , foodRanking , portionSize, calories, description ,reporter) {
        //add the record id number primary key to edit text box (id: txid)
        //this is easiest way to get and store primary key
        document.getElementById("txId").value               =mealId;
        // store the food name into edit text
        document.getElementById("txFoodName").value         =foodName ;
        //add food group to edit text food group
        document.getElementById("txFoodGroup").value        =foodGroup ;
        // once user clicks from list view then meal type is store in tx meal type edit text
        document.getElementById("txMealTypes").value        =mealType;
        document.getElementById("txTime").value             =time;
        document.getElementById("txDate").value             =date;
        document.getElementById("txNotes").value            =note;
        document.getElementById("txFoodRanking").value      =foodRanking;
        document.getElementById("txPortionSize").value      =portionSize;
        document.getElementById("txCaloriesNumber").value   =calories;
        document.getElementById("txDescription").value      =description ;
        document.getElementById("txReporter").value         =reporter;
        document.getElementById("lbFoodname").innerHTML     =foodName  ;
        document.getElementById("lbFoodGroup").innerHTML    =foodGroup+
        "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+ calories+" Cal(g)" ;
        document.getElementById("lbTime").innerHTML         =date +"&nbsp&nbsp&nbsp&nbspat "+time;
        document.getElementById("lbReporter").innerHTML     =reporter;
        document.getElementById("lbRanking").innerHTML      =foodRanking;
        document.getElementById("spDescription").innerHTML  =description;
        getPhoto();

      }

// insert new record
function InsertNewRecord(){
        var r = confirm(// before adding new record show confirm message to a user, just in case user might left something left or forget.
         // this is a confirmation message format that a user will see when they clicks the submit button and all required fields are set appropiatly
          "Please, confirm following details: "+ "\n" + "\n" +
          "Food Name:   " + document.getElementById("txFoodName").value + "\n" +
          " Food Group:  " + document.getElementById("txFoodGroup").value+ "\n" +
          "            Time:   " + document.getElementById("txTime").value+ "\n" +
          "            Date:   " + document.getElementById("txDate").value + "\n" +
          "     Reporter:   " + document.getElementById("txReporter").value+ "\n" );
        if (r == true){// this will checks wheather user clicks the ok or cancel button from confirm message dialog box which will display on submit button hit
          var calories= '385';var ranking= 'Fair'; var portion= 'Small'; var Description= '';
          db.transaction(function(transaction) {
          //insert into database table called my food fileds name as below
          transaction.executeSql('INSERT INTO myFood(FoodName, FoodGroup, MealType, Time, Date, Note, Reporter, FoodRanking, PortionSize, Calories, Description, Image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
          ,[$('#txFoodName').val(), $('#txFoodGroup').val(), $('#txMealTypes').val(), $('#txTime').val(), $('#txDate').val(), $('#txNotes').val(), $('#txReporter').val(), ranking, portion, calories, Description, $('#txImage').val()],
          nullHandler, errorHandler);
          });// show the alert message to user that their new added role is insert into datase
          navigator.notification.alert(document.getElementById("txFoodName").value  ,"","New Food Record Inserted");
          window.location = "Home.html";// once new row is insert into database then take user into home page, also reload the page so that user can see new record on top of the page
           }
         }
// update the current record<!--(Sean, 2014)  -->
function UpdateValueToDB() {
    db.transaction(function(transaction) {
    //update current table called my food fields name are as below
    transaction.executeSql('UPDATE myFood SET FoodName=?, FoodGroup=?, MealType=?, Time=?, Date=?, Note=?, Reporter=?  where MealId=?;'
    ,[$('#txFoodName').val(), $('#txFoodGroup').val(), $('#txMealTypes').val(), $('#txTime').val(), $('#txDate').val(), $('#txNotes').val(), $('#txReporter').val(), $('#txId').val()],
    nullHandler, errorHandler);});
    // once all the fields are updated successfully then show alert message to user that display the success message
    navigator.notification.alert(" Successfully saved as "+$('#txDate').val() ,"",$('#txFoodName').val());
    refreshHome();// again after update the record then refresh home and redirect user to main page.
    return false;
}
function UpdateNote() {//this will update the note page when user is called the save button from note page
// read check box carefully from note page, below code is display how author like to contro the check boxes
 if (document.getElementById('r1').checked) {
  txPortionSize = document.getElementById('r1').value;
   }else if (document.getElementById('r2').checked) {
  txPortionSize = document.getElementById('r2').value;
  }else if (document.getElementById('r3').checked) {
  txPortionSize = document.getElementById('r3').value;}
  // after successfully checking the check boxes, then store that value from check into new edit text that hidden from user view
  document.getElementById('txPortionSize').value= txPortionSize  ;
  db.transaction(function(transaction) {
  // once all check boxed and range bar are carefully handle, now time to store the those values into table fields as below
      transaction.executeSql('UPDATE myFood SET FoodRanking=?, PortionSize=?, Calories=?, Description=?, Image=? where MealId=?;'
      ,[$('#txFoodRanking').val(), $('#txPortionSize').val(), $('#txCalories').val(), $('#txDescription').val(), $('#txImage').val(), $('#txId').val()],
      nullHandler, errorHandler);});
      // to good user interaction display the alert message to a user so that they knows what happen next and/or why.
  navigator.notification.alert($('#txFoodName').val()+" is  Saved! ","","Successful");
  redirectHome();// also refresh the home page then bring back a user to main page so that they can have more options.
}
// delete the previous data record
function DeleteFromDB() {
   // display the confirmation dialog box to the user before deleting any of the food record from the database table.
   var r = confirm("Are you sure you want to delete? "+ "\n"+
   "        "+$('#txFoodName').val());//<!--(Sqlitetutorial.net, 2017)  -->
   if (r == true){// when user hit ok button from the confirm dialog box then start extricute the following  delete sqlite query
       db.transaction(function(transaction) {
       // simply sqlite query, that saying delete from database where mail id is equal to given id.
          transaction.executeSql('DELETE FROM myFood WHERE MealId =?;', [document.getElementById("txId").value],
          nullHandler, errorHandler);});
          // once all the sqlite query is extricute and after successfully deleting the record from table
          //show the alert message to user that it is successfull
           navigator.notification.alert($('#txFoodName').val()+" is  deleted! ","","Deleted");
           refreshHome();// refresh the home page and database so that user can able to see the deleted record move from the databse.
        }
        return false;
}

//opening the note page & setting up check boxes
function callNotePage(){
    redirectNote();// once user is click the "Add note " button this method will extricute
    // once this method is called, following code will set up the check box and range bar for that particular food record in the note page
    if ($('#txPortionSize').val()=== document.getElementById('r1').value)
     document.getElementById('r1').checked= true;
     else if ( $('#txPortionSize').val()=== document.getElementById('r2').value)
     document.getElementById('r2').checked= true;
     else if ($('#txPortionSize').val()=== document.getElementById('r3').value)
     document.getElementById('r3').checked= true;
    $('#Note').page(); // refresh the note page so that range bar can set up easily
    $('#txCalories').val($('#txCaloriesNumber').val());// Set up the range bar when user is call this method (in other word clicking the "Add note" button from the main page
    $('#txCalories').slider('refresh');// Once the range bar (slider ) is set up then it is important to refresh the slider bar for up to date value
 }
// drop the table
function DeleteAll() {// this will clear all the data from myfood table which is in WebSqlDB database.
  var r = confirm("Are you sure you want to reset? "+ "\n" + "\n" +
  "Reset will clear all data.");
  // confirm will show to user before deleting any of the record from the database, when a user clicks the "ok" button form the confirm message box it will clear all the data from the database
    if (r == true){
       db.transaction(function(transaction) {
          transaction.executeSql('DROP TABLE myFood', [],
          nullHandler, errorHandler);});
        redirectHome();
        return false;
}
}

//Taking image for web cam<!--(MacCutchan, 2015)     -->
function takePhoto() {
navigator.camera.getPicture(onSuccess, onCameraError , { quality: 100,
destinationType: Camera.DestinationType.DATA_URL });
}
function onSuccess(imageURI) {
  $('#image').html('');
var image = document.getElementById('imageContainer');
image.src = imageURI;
document.getElementById("txImage").value =image.src;
             var src="data:image/png;base64,"+ imageURI;
             if (document.getElementById("txImage").value == 'undefined' ){
             var src="Image/Unknown.jpg";
         }
$('#image').append('<img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" >');
} // user click the check from web cam store the image on edit text and display back to user
function onCameraError(e) {
console.log(e);
navigator.notification.alert("onCameraError: " + e +" ");
}// when user cancel the while taking the image
function DeletePhoto() {
    if (document.getElementById("txImage").value == 'undefined' ){
    alert("There is no picture of food name "+$('#txFoodName').val()+" ");
    } else{
    var r = confirm("Are you Sure you want to delete the picture." + "\n"+ "Food name:  " + document.getElementById("txFoodName").value + "\n");
    if (r == true){
    document.getElementById("txImage").value  = 'undefined'  ;
    db.transaction(function(transaction) {
    transaction.executeSql('UPDATE myFood SET Image=? where MealId=?;'
    ,[$('#txImage').val(), $('#txId').val()],
    nullHandler, errorHandler);});
    alert("Picture of food name "+$('#txFoodName').val()+" is deleted! ");
    getPhoto();
    return false;
    }
}

} // deleting image only if there is any image in the database.
function getPhoto() {
$('#image').html('');$('#images').html('');
     db.transaction(function(transaction) {//select all image from my food table
     transaction.executeSql('SELECT Image FROM myFood WHERE MealId=?;',[document.getElementById("txId").value ],
            function(transaction, result) {
            if (result !== null && result.rows !== null) {
            for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            document.getElementById("txImage").value = row.Image;
            var src="data:image/png;base64,"+ document.getElementById("txImage").value ;
            if (document.getElementById("txImage").value == 'undefined' ){
            var src="Image/Unknown.jpg";}
            $('#image').append('<img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" >');
            $('#images').append('<img style="background-image:url(Unknown.png)" src="'+src+'" width="120" height="100" >');
              }
           }
        }, errorHandler);
      }, errorHandler, nullHandler);
    return false;
    } // display specific image to user

//Drop down index change
function dwFoodName(value) {
$('#myNewListView').html('');  $('#dwFoodName').val('1');
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM myFood WHERE FoodName LIKE ?;',  ['%'+value+'%'],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {
         var date = document.getElementById("dwDate");
         var group = document.getElementById("dwFoodGroups");
         var reporter = document.getElementById("dwReporter");
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var d = new Date(row.Date);
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July",
                                "August", "September", "October","November", "December" ];
            document.getElementById("txImage").value = row.Image;
             var src="data:image/png;base64,"+ document.getElementById("txImage").value ;
            if (document.getElementById("txImage").value == 'undefined' ){
               var src="Image/Unknown.jpg";            }var day = d.getDate() + 1 ;
             $('#myNewListView').append('<br><li data-role="list-divider">'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+d.getDate() +', '+d.getFullYear()+' <span class="ui-li-count">'+row.Time+'</span></li><li><a onclick="myFunction(\''+
                              row.MealId + '\',\'' +  row.FoodName + '\',\'' +  row.FoodGroup + '\',\''+  row.Time  + '\',\'' +   row.Date + '\',\'' +   row.MealType + '\',\'' +   row.Note + '\',\'' +   row.FoodRanking + '\',\'' +   row.PortionSize + '\',\'' +   row.Calories + '\',\''  +   row.Description + '\',\'' +  row.Reporter+
                               '\');" href="#popupMainMenu" data-rel="popup" data-transition="slide" class="ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-bullets ui-btn-icon-right ui-btn-inline ui-mini">'+
                 ' <table width="100%"><tr><td><img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" ></td><td><h2 style="font-size:16px; text-align:left;">' +row.FoodName +'</h2></p><strong style="font-size:12px;"> '+' Category: '+row.FoodGroup+ ' added by '+ row.Reporter +'. </strong></p> <p class="ui-li-aside"><strong style="font-size:12px;">'+row.Calories+'Cal (g)</strong></p></td></tr></table></a></li>');
                 $('#myNewListView').listview('refresh');
                  }      }    }, errorHandler);  }, errorHandler, nullHandler);
      $('#txCalories').val($('#txCaloriesNumber').val());
      $('#txCalories').slider('refresh');
      return;
} // display the drop down list value of food name
function dwFoodGroups(value) {
$('#myNewListView').html('');$('#dwFoodGroups').val('1');
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM myFood where FoodGroup LIKE ?;',  ['%'+value+'%'],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {
         var date = document.getElementById("dwDate");
         var group = document.getElementById("dwFoodGroups");
         var reporter = document.getElementById("dwReporter");
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var d = new Date(row.Date);
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July",
                                "August", "September", "October","November", "December" ];
            document.getElementById("txImage").value = row.Image;
             var src="data:image/png;base64,"+ document.getElementById("txImage").value ;
            if (document.getElementById("txImage").value == 'undefined' ){
               var src="Image/Unknown.jpg";            }var day = d.getDate() + 1 ;
                 $('#myNewListView').append('<br><li data-role="list-divider">'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+d.getDate() +', '+d.getFullYear()+' <span class="ui-li-count">'+row.Time+'</span></li><li><a onclick="myFunction(\''+
                                  row.MealId + '\',\'' +  row.FoodName + '\',\'' +  row.FoodGroup + '\',\''+  row.Time  + '\',\'' +   row.Date + '\',\'' +   row.MealType + '\',\'' +   row.Note + '\',\'' +   row.FoodRanking + '\',\'' +   row.PortionSize + '\',\'' +   row.Calories + '\',\''  +   row.Description + '\',\'' +  row.Reporter+
                                   '\');" href="#popupMainMenu" data-rel="popup" data-transition="slide" class="ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-bullets ui-btn-icon-right ui-btn-inline ui-mini">'+
                     ' <table width="100%"><tr><td><img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" ></td><td><h2 style="font-size:16px; text-align:left;">' +row.FoodName +'</h2></p><strong style="font-size:12px;"> '+' Category: '+row.FoodGroup+ ' added by '+ row.Reporter +'. </strong></p> <p class="ui-li-aside"><strong style="font-size:12px;">'+row.Calories+'Cal (g)</strong></p></td></tr></table></a></li>');
                     $('#myNewListView').listview('refresh');
            }      }    }, errorHandler);  }, errorHandler, nullHandler);
      $('#txCalories').val($('#txCaloriesNumber').val());
      $('#txCalories').slider('refresh');
      return;
} // load data for food group
function dwDate(value) {
$('#myNewListView').html('');$('#dwDate').val('1');
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM myFood where Date LIKE ?;',  ['%'+value+'%'],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {
         var date = document.getElementById("dwDate");
         var group = document.getElementById("dwFoodGroups");
         var reporter = document.getElementById("dwReporter");
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var d = new Date(row.Date);
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July",
                                "August", "September", "October","November", "December" ];
            document.getElementById("txImage").value = row.Image;
             var src="data:image/png;base64,"+ document.getElementById("txImage").value ;
            if (document.getElementById("txImage").value == 'undefined' ){
               var src="Image/Unknown.jpg";            }var day = d.getDate() + 1 ;
           $('#myNewListView').append('<br><li data-role="list-divider">'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+d.getDate() +', '+d.getFullYear()+' <span class="ui-li-count">'+row.Time+'</span></li><li><a onclick="myFunction(\''+
                            row.MealId + '\',\'' +  row.FoodName + '\',\'' +  row.FoodGroup + '\',\''+  row.Time  + '\',\'' +   row.Date + '\',\'' +   row.MealType + '\',\'' +   row.Note + '\',\'' +   row.FoodRanking + '\',\'' +   row.PortionSize + '\',\'' +   row.Calories + '\',\''  +   row.Description + '\',\'' +  row.Reporter+
                             '\');" href="#popupMainMenu" data-rel="popup" data-transition="slide" class="ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-bullets ui-btn-icon-right ui-btn-inline ui-mini">'+
               ' <table width="100%"><tr><td><img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" ></td><td><h2 style="font-size:16px; text-align:left;">' +row.FoodName +'</h2></p><strong style="font-size:12px;"> '+' Category: '+row.FoodGroup+ ' added by '+ row.Reporter +'. </strong></p> <p class="ui-li-aside"><strong style="font-size:12px;">'+row.Calories+'Cal (g)</strong></p></td></tr></table></a></li>');
               $('#myNewListView').listview('refresh');
              }      }    }, errorHandler);  }, errorHandler, nullHandler);
      $('#txCalories').val($('#txCaloriesNumber').val());
      $('#txCalories').slider('refresh');
      return;
} // show the specific the data
function dwReporter(value) {
$('#myNewListView').html('');$('#dwReporter').val('1');
  db.transaction(function(transaction) {
    transaction.executeSql('SELECT * FROM myFood where Reporter LIKE ?;',  ['%'+value+'%'],
    function(transaction, result) {
      if (result !== null && result.rows !== null) {
         var date = document.getElementById("dwDate");
         var group = document.getElementById("dwFoodGroups");
         var reporter = document.getElementById("dwReporter");
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var d = new Date(row.Date);
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July",
                                "August", "September", "October","November", "December" ];
            document.getElementById("txImage").value = row.Image;
             var src="data:image/png;base64,"+ document.getElementById("txImage").value ;
            if (document.getElementById("txImage").value == 'undefined' ){
               var src="Image/Unknown.jpg";            }var day = d.getDate() + 1 ;
                $('#myNewListView').append('<br><li data-role="list-divider">'+days[d.getDay()]+', '+ monthNames[d.getMonth()]+'  '+d.getDate() +', '+d.getFullYear()+' <span class="ui-li-count">'+row.Time+'</span></li><li><a onclick="myFunction(\''+
                                 row.MealId + '\',\'' +  row.FoodName + '\',\'' +  row.FoodGroup + '\',\''+  row.Time  + '\',\'' +   row.Date + '\',\'' +   row.MealType + '\',\'' +   row.Note + '\',\'' +   row.FoodRanking + '\',\'' +   row.PortionSize + '\',\'' +   row.Calories + '\',\''  +   row.Description + '\',\'' +  row.Reporter+
                                  '\');" href="#popupMainMenu" data-rel="popup" data-transition="slide" class="ui-shadow ui-btn ui-corner-all ui-btn-b ui-icon-bullets ui-btn-icon-right ui-btn-inline ui-mini">'+
                    ' <table width="100%"><tr><td><img style="background-image:url(Unknown.png)" src="'+src+'" width="90" height="80" ></td><td><h2 style="font-size:16px; text-align:left;">' +row.FoodName +'</h2></p><strong style="font-size:12px;"> '+' Category: '+row.FoodGroup+ ' added by '+ row.Reporter +'. </strong></p> <p class="ui-li-aside"><strong style="font-size:12px;">'+row.Calories+'Cal (g)</strong></p></td></tr></table></a></li>');
                    $('#myNewListView').listview('refresh');
              }      }    }, errorHandler);  }, errorHandler, nullHandler);
      $('#txCalories').val($('#txCaloriesNumber').val());
      $('#txCalories').slider('refresh');
      return;
} // read the reporter name from drop down list
function openFilter() {
           if(document.getElementById('filter').style.display == 'inherit')
           document.getElementById('filter').style.display = 'none';
           else
           document.getElementById('filter').style.display = 'inherit';
           } // open and close the filter drop down lists

//Pages Redirection <!-- ([duplicate], 2017) -->
function feedback(){window.location.replace("mailto:ma9892@greenwich.ac.uk?subject=This is a feedback mobile application&body= Your app is too simple and basic !!!");}
function redirectHelp(){window.location = "Help.html";}
function redirectFAQ(){window.location = "FAQ.html";}
function redirectHome(){window.location = "Home.html";}
function redirectUpdate(){nameCheck();window.location = "Home.html#Update";}
function redirectAddNew(){window.location = "AddNew.html";}
function redirectNote(){window.location = "Home.html#Note";}
function refreshHome(){location.reload();window.location.replace("Home.html");}
function loadImage() {}

//key up validaiton for edit text<!--  (easy!, 2013)   -->
function nameCheck() {
        $('#txFoodName').keyup(function()
         {
            db.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM myFood WHERE FoodName=?;', [document.getElementById("txFoodName").value],
                 function(transaction, result) {
                   if (result.rows.length>0)
                   {
                    document.getElementById("btnAdd").disabled = true;
                     document.getElementById('Label1').innerHTML = 'Food name '+ document.getElementById("txFoodName").value  +' is been taken! ';
                     document.getElementById("txFoodName").focus();
                   } else  if (document.getElementById("txFoodName").value == ''){
                    document.getElementById("btnAdd").disabled = true;
                  document.getElementById('Label1').style.display = 'inherit';
                  document.getElementById('Label1').innerHTML = 'Please, enter food name.';
                  document.getElementById('Label2').style.display = 'none';
                  document.getElementById('Label3').style.display = 'none';
                  document.getElementById('Label4').style.display = 'none';
                  document.getElementById('Label5').style.display = 'none';
                  }  else if ($('#txFoodName').val().length < 2){
                   document.getElementById("btnAdd").disabled = true;
                  document.getElementById('Label1').style.display = 'inherit';
                  document.getElementById('Label1').innerHTML = 'Two letters required for food name.  ';
                  document.getElementById('Label2').style.display = 'none';
                  document.getElementById('Label3').style.display = 'none';
                  document.getElementById('Label4').style.display = 'none';
                  document.getElementById('Label5').style.display = 'none';
                  } else {
                  document.getElementById('Label1').innerHTML = ' ';
                            document.getElementById("btnAdd").disabled = false;
                  }
                 }, errorHandler);
              }, errorHandler, nullHandler);
          });
            $('#txReporter').keyup(function()
          {
                    if (document.getElementById("txReporter").value == "")
                   { document.getElementById("btnAdd").disabled = true;
                    document.getElementById('Label1').style.display = 'none';
                    document.getElementById('Label2').style.display = 'none';
                    document.getElementById('Label3').style.display = 'inherit';
                    document.getElementById('Label3').innerHTML = 'Please, give reporter name. ';
                    document.getElementById('Label4').style.display = 'none';
                    document.getElementById('Label5').style.display = 'none';
                   } else if ($('#txReporter').val().length < 2){
                    document.getElementById("btnAdd").disabled = true;
                    document.getElementById('Label1').style.display = 'none';
                    document.getElementById('Label2').style.display = 'none';
                    document.getElementById('Label3').style.display = 'inherit';
                    document.getElementById('Label3').innerHTML = 'Two letters required for reporter name.  ';
                    document.getElementById('Label4').style.display = 'none';
                    document.getElementById('Label5').style.display = 'none';
                  } else {
                  document.getElementById('Label3').innerHTML = ' ';
                             document.getElementById("btnAdd").disabled = false;
                  }
          });

           } // key up validation for food and reporter name edit text.<!-- (value, 2008)    -->
function validate(clicked_id) {

    if (document.getElementById("txFoodName").value == ""){
    document.getElementById('Label1').style.display == 'inherit';
    document.getElementById('Label1').innerHTML = 'Please, enter food name.';
    document.getElementById('Label2').style.display = 'none';
    document.getElementById('Label3').style.display = 'none';
    document.getElementById('Label4').style.display = 'none';
    document.getElementById('Label5').style.display = 'none';

    }else if ($('#txFoodName').val().length < 2){
    document.getElementById('Label1').style.display = 'inherit';
    document.getElementById('Label1').innerHTML = 'Two letters required for food name.  ';
    document.getElementById('Label2').style.display = 'none';
    document.getElementById('Label3').style.display = 'none';
    document.getElementById('Label4').style.display = 'none';
    document.getElementById('Label5').style.display = 'none';

    }else if (document.getElementById("txFoodGroup").value == ""){

    document.getElementById('Label1').style.display = 'none';
    document.getElementById('Label2').style.display = 'inherit';
    document.getElementById('Label2').innerHTML = 'Please, select the food group. ';
    document.getElementById('Label3').style.display = 'none';
    document.getElementById('Label4').style.display = 'none';
    document.getElementById('Label5').style.display = 'none';
    }else if (document.getElementById("txTime").value == ""){
    document.getElementById('Label1').style.display = 'none';
    document.getElementById('Label2').style.display = 'none';
    document.getElementById('Label3').style.display = 'none';
    document.getElementById('Label4').style.display = 'inherit';
    document.getElementById('Label4').innerHTML = 'Please, select time. ';
    document.getElementById('Label5').style.display = 'none';
    }else if (document.getElementById("txDate").value == ""){
    document.getElementById('Label5').style.display = 'inherit';
    document.getElementById('Label5').innerHTML = 'Please, select date. ';
    document.getElementById('Label1').style.display = 'none';
    document.getElementById('Label2').style.display = 'none';
    document.getElementById('Label3').style.display = 'none';
    document.getElementById('Label4').style.display = 'none';
      }else if (document.getElementById("txReporter").value == ""){
    document.getElementById('Label1').style.display = 'none';
    document.getElementById('Label2').style.display = 'none';
    document.getElementById('Label3').style.display = 'inherit';
    document.getElementById('Label3').innerHTML = 'Please, give reporter name. ';
    document.getElementById('Label4').style.display = 'none';
    document.getElementById('Label5').style.display = 'none';
    }else{
     if (clicked_id == 'btnAdd'){
      InsertNewRecord();
     }else{
     UpdateValueToDB();
     }
         document.getElementById('Label1').style.display = 'none';
         document.getElementById('Label2').style.display = 'none';
           document.getElementById('Label3').style.display = 'none';
             document.getElementById('Label4').style.display = 'none';
                 document.getElementById('Label5').style.display = 'none';
    }
}//When user does not enter required fields error message will show.
function isAlphabet(elem, helperMsg) {// This function only take letters
     var alphaExp =/^[a-zA-Z\s]*$/;
     if(elem.value.match('')){
      db.transaction(function(transaction) {
                 transaction.executeSql('SELECT * FROM myFood WHERE FoodName=?;', [elem.value],
                      function(transaction, result) {
                        if (result.rows.length>0){
                          document.getElementById('Label1').innerHTML = 'Food name '+ document.getElementById("txFoodName").value  +' is been taken! ';
                          document.getElementById("txFoodName").focus();
                          document.getElementById("btnUpdate").disabled = true;
                          document.getElementById("btnAdd").disabled = true;
                        } else {
                          document.getElementById('Label1').innerHTML = ' ';
                          document.getElementById("btnUpdate").disabled = false;
                        }
                      }, errorHandler);
                   }, errorHandler, nullHandler);
     }
     if(elem.value.match(alphaExp)){
         return true;
    } else{
         alert(helperMsg);elem.focus();elem.value = "";
         return false;
     }
 }// key up validation for food name that has to be letters and min 2 char..
function isNumber(elem, helperMsg) {
      var alphaExp =/^\d+$/;
      if(elem.value.match(alphaExp))
          return true;
      else{
          alert(helperMsg);elem.focus();elem.value = "";
          return false;
      }
  }// This function only take letters

