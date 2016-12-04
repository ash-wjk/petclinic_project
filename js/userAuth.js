$(document).ready(function() {

  console.log("page is ready");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrNy1HQcvLI0sNTej5CAqlNR0zPxE3GeY",
    authDomain: "petclinic-c1bdb.firebaseapp.com",
    databaseURL: "https://petclinic-c1bdb.firebaseio.com",
    storageBucket: "petclinic-c1bdb.appspot.com",
    messagingSenderId: "112801924884"
  };
  firebase.initializeApp(config);

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
    var $form = $(this);
    $form.find("#logSubmit").prop('disabled', true);
    var email = $form.find("#logEmail").val();
    var password = $form.find("#logPassword").val();
    handleSignIn(email,password);
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
