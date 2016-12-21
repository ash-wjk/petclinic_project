'use strict';

// Shortcuts to DOM Elements.
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var userGreetingText = document.getElementById('user-greeting-text');


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
    userGreetingText.innerHTML = 'Hi ' + user.email;

    $('#signinPopup').modal('hide');


    // writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    // startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    signOutButton.style.display = 'none';
    userGreetingText.style.display = 'none';
    signInButton.style.display = 'initial';

    // Display the splash page where you can sign-in.
    //splashPage.style.display = '';
  }
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
