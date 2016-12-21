$(document).ready(function() {

  console.log("page is ready");

  // Registration
  $('#registerForm').submit(function(event) {

    var $form = $(this);
    $form.find("#regSubmit").prop('disabled', true);
    var email = $form.find("#regEmail").val();
    var password = $form.find("#regPassword").val();
    handleSignUp(email,password);
    return false;

  });

  // Signin
  $('#signinForm').submit(function(event) {
    console.log("signinForm");
    var $form = $(this);
    $form.find("#logSubmit").prop('disabled', true);
    var email = $form.find("#logEmail").val();
    var password = $form.find("#logPassword").val();
    handleSignIn(email,password);
    return false;

  });

  // Book appointment
  $('#bookForm').submit(function(event) {
    var $form = $(this);
    $form.find("#bookSubmit").prop('disabled', true);
    var uid = "xxxx";
    // id,username,email,date,time,doctor,details
    var username = "asha wjk";
    var email = "ddd@dddd.com";
    var date = new Date();
    var time = "1-2";
    var doctor = "mr cv";
    var details = "details d d d ";
    console.log("bookForm");
    addAppointmentRequest(uid,username,date,date,time,doctor,details);
    return false;
  });

});


/**
 * Handles the sign up button press.
 */
 function handleSignUp(email,password) {
  // Sign up with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}

/**
* Handles the sign in button press.
*/
function handleSignIn(email,password) {
 // Sign in with email and pass.
 // [START authwithemail]
 firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // [START_EXCLUDE]
   if (errorCode === 'auth/wrong-password') {
     alert('Wrong password.');
   } else {
     alert(errorMessage);
   }
   console.log(error);
   document.getElementById('logSubmit').disabled = false;
   // [END_EXCLUDE]
 }).then(function(user){
   if(user !=null ){
   alert("Logged in with "+user.email);
 }
 });
 // [END authwithemail]
}

/**
* Add pet details.
*/

function addPet(uid,username,type,name,breed) {
  // A pet entry.
  var postData = {
    owner: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };
}

/**
* Add Appointment request details.
*/
function addAppointmentRequest(uid,username,email,date,time,doctor,details) {
  console.log("addAppointmentRequest");
  // An appointment entry.
  var appointmentRequestData = {
    owner: username,
    uid: uid,
    date: date,
    time: time,
    email: email,
    doctor: doctor,
    details: details
  };

  // Get a key for appointment
  var newRequestKey = firebase.database().ref().child('appointmentRequests').push().key;

  // Write the new appointment request's data
  var updates = {};
  updates['/appointmentRequests/' + newRequestKey] = appointmentRequestData;

  return firebase.database().ref().update(updates);
}
