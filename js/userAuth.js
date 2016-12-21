$(document).ready(function() {

  console.log("page is ready");

  // Signin
  $('#logSubmit').click(function(){
    console.log("signinForm submit");
    $("#logSubmit").prop('disabled', true);
    var email = $("#logEmail").val();
    var password = $("#logPassword").val();
    handleSignIn(email,password);
     $('#signinForm')[0].reset();
     $('#signinForm').data('bootstrapValidator').resetForm();
    return false;

  });

});

/**
* Handles the sign in button press.
*/
function handleSignIn(email,password) {
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
   document.getElementById('logSubmit').disabled = false;
   // [END_EXCLUDE]
 });
 // [END authwithemail]
}
