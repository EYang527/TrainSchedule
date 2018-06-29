  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAav8lCRfpF_Du7O8C-CfVaQyphQpWNVtU",
    authDomain: "myfirstfirebase-7fa8f.firebaseapp.com",
    databaseURL: "https://myfirstfirebase-7fa8f.firebaseio.com",
    projectId: "myfirstfirebase-7fa8f",
    storageBucket: "myfirstfirebase-7fa8f.appspot.com",
    messagingSenderId: "760587793334"
  };
  firebase.initializeApp(config);


  // Create a variable to reference the database.
var database = firebase.database();

// /trainRef references a specific location in our database.
// All of our connections will be stored in this directory.
var trainRef = database.ref("/trainDatabase");

var trainName = "";
var trainDestination = "";
var startTime = 0000;
var trainFrequency = 00;

$("#submit-Train").on("click", function() {
	event.preventDefault();  // disable page refresh
  // Get the input values
  var trainName = $("#input-TrainName").val().trim();
  var trainDestination = $("#input-Destination").val().trim();
  var trainTime = moment($("#input-FirstTrain").val().trim(), "HH:mm").format();
  var trainFrequency = parseInt($("#input-Frequency").val().trim());

 
 // Create local object to hold data in order to push in firebase
  var newTrain = {
    trainName: trainName,
    trainDestination: trainDestination,
    trainTime: trainTime,
    trainFrequency: trainFrequency,
}

// Save the new train in Firebase
database.ref("/trainDatabase").push(newTrain);

// console log new train info
console.log(newTrain.trainName);
console.log(newTrain.trainDestination);
console.log(newTrain.trainTime);
console.log(newTrain.trainFrequency);

console.log("Train successfully added");
// put in a div 


// Clears all the inputs from Form
$("#input-TrainName").val("");
$("#input-Destination").val("")
$("#input-FirstTrain").val("")
$("#input-Frequency").val("");


// Prevents moving to new page
//return false;

});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref("/trainDatabase").on("child_added", function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	// Store everything into a variable.
  var name = childSnapshot.val().trainName;
  var destination = childSnapshot.val().trainDestination;
  var time = childSnapshot.val().trainTime;
  var frequency = childSnapshot.val().trainFrequency;

  console.log(name);
  console.log(destination);
  console.log(time);
  console.log(frequency);

  // First Train Time (pushed back 1 year to make sure it comes before current time)
    var trainTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    console.log("1st train: ",trainTimeConverted);

  // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trainRemainder = diffTime % frequency;
    console.log(trainRemainder);

    // Minute Until Train
    var trainMinutesTill = frequency - trainRemainder;
    console.log("MINUTES TILL TRAIN: " + trainMinutesTill);

    // Next Train
    var nextTrain = moment().add(trainMinutesTill, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  

  // Add each train's data into the table
  $("#train-info> tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + trainMinutesTill + "</td><td>" + "" + "</td></tr>");
});