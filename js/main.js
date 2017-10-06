$(document).ready(function() {
	// Start Firebase
    var config = {
        apiKey: "AIzaSyCCvts9xarbQN5yK7DLenVrGwZuTo2sVWg",
        authDomain: "catfinder-b90a1.firebaseapp.com",
        databaseURL: "https://catfinder-b90a1.firebaseio.com/",
        projectId: "catfinder-b90a1",
        storageBucket: "gs://catfinder-b90a1.appspot.com",
        messagingSenderId: "286010632123"
    };
    // library
    firebase.initializeApp(config);

    //prepare database
    var database = firebase.database();


    $(function() {
	
});
