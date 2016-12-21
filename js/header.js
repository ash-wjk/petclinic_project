'use strict';

function onAuthStateChanged(user) {
  console.log("onAuthStateChanged");
  console.log(user);
}

// Bindings on load.
window.addEventListener('load', function() {
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

}, false);
