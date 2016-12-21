'use strict';

// Shortcuts to DOM Elements.
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var userGreetingText = document.getElementById('user-greeting-text');

var adminButton = document.getElementById('admin-button');

var regFname = document.getElementById('reg-fname');
var regLname = document.getElementById('reg-lname');
var regPhone = document.getElementById('reg-phone');
var regEmail = document.getElementById('reg-email');
var regPassword = document.getElementById('reg-password');
var regCPassword = document.getElementById('reg-c-password');


/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  //cleanupUi();
  if (user) {
    console.log(user);
    currentUID = user.uid;

    signOutButton.style.display = 'initial';
    userGreetingText.style.display = 'initial';
    signInButton.style.display = 'none';
    setCurrentFirstName();

    regFname.style.display = 'none';
    regLname.style.display = 'none';
    regPhone.style.display = 'none';
    regEmail.style.display = 'none';
    regPassword.style.display = 'none';
    regCPassword.style.display = 'none';

    $('#signinPopup').modal('hide');
    $('#registerPopup').modal('hide');

    if(user.email === 'admin@pcc.com'){
      adminButton.style.display = 'initial';
    }else {
      adminButton.style.display = 'none';
    }

    // writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    // startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    signOutButton.style.display = 'none';
    userGreetingText.style.display = 'none';
    signInButton.style.display = 'initial';
    adminButton.style.display = 'none';

    regFname.style.display = 'initial';
    regLname.style.display = 'initial';
    regPhone.style.display = 'initial';
    regEmail.style.display = 'initial';
    regPassword.style.display = 'initial';
    regCPassword.style.display = 'initial';


    // Display the splash page where you can sign-in.
    //splashPage.style.display = '';
  }
}

/**
 * Handles the sign up button press.
 */
 function handleSignUp(email,password,fname,lname,phone,petType,petName,breed) {
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
  }).then(function(user){
    if(user !=null ){
      console.log("created");
      handleSignIn(email,password,fname,lname,phone,petType,petName,breed);
  }
  });
  // [END createwithemail]
}

/**
* Handles the sign after Registration.
*/
function handleSignIn(email,password,fname,lname,phone,petType,petName,breed) {
  console.log("handleSignIn ");
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
   // [END_EXCLUDE]
 }).then(function(user){
   if(user !=null ){
     addUser(user.uid,fname,lname,phone,petType,petName,breed);
 }
 });
 // [END authwithemail]
}

/**
* Add user details.
*/

function addUser(userId,fname,lname,phone,petType,petName,breed) {
  // A User entry.
  var postData = {
    fname:fname,
    lname:lname,
    phone: phone,
    petType: petType,
    petName: petName,
    breed: breed
  };

  firebase.database().ref('users/' + userId).set(postData);

}

/**
* Add pet details.
*/

function addPet(userId,username,type,name,breed) {
  // A pet entry.
  var postData = {
    owner: username,
    type:type,
    breed:breed
  };

  firebase.database().ref('pets/' + userId + '/' + name).set(postData);
}



/**
 * Get user's  first name
 */
function setCurrentFirstName() {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().fname;
    // [START_EXCLUDE]
    userGreetingText.innerHTML = 'Hi ' + username;
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}

/**
 * Set user's  other pets
 */
function setPet(petType,petName,breed) {
  // [START single_value_read]
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = snapshot.val().fname;
    // [START_EXCLUDE]
    return addPet(userId,username,petType,petName,breed);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}


/**
* Add Appointment request details.
*/
function addAppointmentRequest(uid,username,email,date,time,doctor,details) {
  // An appointment entry.
  var appointmentRequestData = {
    uid: uid,
    date: date,
    time: time,
    email: email,
    doctor: doctor,
    details: details
  };

  console.log(appointmentRequestData);

  // Get a key for appointment
  var newRequestKey = firebase.database().ref().child('appointmentRequests').push().key;

  // Write the new appointment request's data
  var updates = {};
  updates['/appointmentRequests/' + newRequestKey] = appointmentRequestData;

  return firebase.database().ref().update(updates);
}


// Bindings on load.
window.addEventListener('load', function() {

  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    currentUID = null;
    firebase.auth().signOut();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

}, false);


$(document).ready(function() {
// Registration
  $('#regSubmit').click(function(event) {
    $("#regSubmit").prop('disabled', true);
    var email = $("#regEmail").val();
    var password = $("#confirmPassword").val();

    var fname = $("#regfName").val();
    var lname = $("#reglName").val();
    var phone = $("#regPhone").val();

    var petType = $("#regPetType").val();
    var petName = $("#regPetName").val();
    var breed = $("#regBreed").val();

    if(currentUID === null){
      handleSignUp(email,password,fname,lname,phone,petType,petName,breed);
    }else {
      setPet(petType,petName,breed);
      $('#registerPopup').modal('hide');
    }


    $('#registerForm')[0].reset();
    $('#registerForm').data('bootstrapValidator').resetForm();
    return false;
  });


  // Book
    $('#bookSubmit').click(function(event) {
      $("#bookSubmit").prop('disabled', true);
      var email = $("#bookEmail").val();

      var fname = $("#bookfName").val();
      var lname = $("#booklName").val();
      var phone = $("#bookPhone").val();

      var petType = $("#bookPetType").val();
      var petName = $("#bookPetName").val();
      var breed = $("#bookBreed").val();

      var date = $("#bookDate").val();
      var time = $("#bookTime").val();
      var doctor = $("#bookDoctor").val();
      var details = $("#bookDetails").val();

      if(currentUID === null){
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        }).then(function(user){
          if(user !=null ){
            addAppointmentRequest(user.uid,fname,email,date,time,doctor,details);
        }
        });
      }else {
        addAppointmentRequest(currentUID,fname,email,date,time,doctor,details);
      }

      $('#bookForm').modal('hide');
      $('#bookForm')[0].reset();
      $('#bookForm').data('bootstrapValidator').resetForm();
      return false;
    });
});
