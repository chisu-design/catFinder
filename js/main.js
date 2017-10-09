// Start Firebase
var config = {
    apiKey: "AIzaSyCCvts9xarbQN5yK7DLenVrGwZuTo2sVWg",
    authDomain: "catfinder-b90a1.firebaseapp.com",
    databaseURL: "https://catfinder-b90a1.firebaseio.com/",
    projectId: "catfinder-b90a1",
    storageBucket: "gs://catfinder-b90a1.appspot.com",
    messagingSenderId: "286010632123"
};

firebase.initializeApp(config);

//get firebase database from config
var database = firebase.database();

// reference_01: https://stackoverflow.com/questions/41427859/get-array-of-items-from-firebase-snapshot
// reference_02: https://www.tutorialspoint.com/firebase/firebase_read_data.htm
function initMap() {

    database.ref('cat/').on("value", function(snapshot) {
        // console.log(snapshot.val());
        var markers = snapshotToArray(snapshot.val());


        //get gps coordinate
        // reference: https://www.w3schools.com/html/html5_geolocation.asp
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var location = { lat: position.coords.latitude, lng: position.coords.longitude };

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: location
                });

                for (i = 0, totalMarkers = markers.length; i < totalMarkers; i++) {

                    var marker = new google.maps.Marker({
                        position: markers[i].location,
                        animation: google.maps.Animation.DROP,
                        map: map,
                        icon: 'https://i.imgur.com/4LAuNoT.png',
                        id: markers[i].id
                    });

                    // This is a click event for google map.
                    // reference: https://developers.google.com/maps/documentation/javascript/examples/event-simple
                    google.maps.event.addListener(marker, 'click', function() {


                        var foundMarkerID;

                        for (i = 0; i < markers.length; i++) {
                            if (markers[i].id === this.id) {
                                foundMarkerID = markers[i];
                            }
                        }

                        // console.log(foundMarkerID)

                        localStorage.setItem('catProfile', JSON.stringify(foundMarkerID));
                        window.location.href = "catInfo.html";




                    });

                }



            });
        } else {
            //execute code here if browser don't support geolocation
            // reference: https://www.w3schools.com/html/html5_geolocation.asp
            x.innerHTML = "Geolocation is not supported by this browser.";
        }



    }, function(error) {
        console.log("Error: " + error.code);
    });

    // converting data of snapshot into an array
    function snapshotToArray(snapshot) {

        var returnArr = [];

        for (shot in snapshot) {
            returnArr.push(snapshot[shot]);
        }


        return returnArr;
    };


}

//Jquery section
$(function() {

    //form data
    var files = null;

// changing the text of the addLocation page
    $('#files').change(function(event) {
        files = event.target.files;
        // console.log(files.length);
        $('#text-overlay').text(files.length);

    });

    $('#myForm').submit(function(event) {
        event.preventDefault();

// reference: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        if (files.length > 0) {
            var possible = 'abcedfghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ0123456789',
                numOfChar = 20,
                uuid = '',
                images = [];


// This generates random ID number for each object inside the cat object. So each cat in my firebase has a unique ID
// that I can use later on.
            for (c = 0; c < numOfChar; c++) {
                uuid += possible.charAt(Math.floor(Math.random() * possible.length));

            }

// reference:https://firebase.google.com/docs/storage/web/upload-files(how to upload image to firebase)

            for (i = 0, numOfFiles = files.length; i < numOfFiles; i++) {

                var imagePath = 'images/' + uuid + '/' + files[i].name;
                var storageRef = firebase.storage().ref(imagePath);

                var insertImage = function(snapshot) {

                    images.push(snapshot.metadata.downloadURLs[0]);

                    //insert data into firebase
                    if (images.length === numOfFiles) {

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position) {

                                database.ref('cat').push({
                                    id: uuid,
                                    name: event.target.catName.value,
                                    location: { lat: position.coords.latitude, lng: position.coords.longitude },
                                    images: images
                                });

                                //go back to the homepage
                                window.location.href = "index.html";

                            });
                        } else {
                            //execute code here if browser does not support geolocation
                            x.innerHTML = "Geolocation is not supported by this browser.";
                        }

                    }


                }

                storageRef.put(files[i]).then(insertImage);


            }
        }




    });



});

// below is reference:
// https://www.w3schools.com/html/html5_geolocation.asp
// https://www.w3schools.com/js/js_loop_for.asp
// https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-predefined
// https://getbootstrap.com/docs/3.3/css/#grid
// https://developers.google.com/maps/documentation/javascript/error-messages#api-not-activated-map-error
// https://developers.google.com/maps/documentation/javascript/infowindows
// https://www.youtube.com/watch?v=z3HD_1qA8Jc&list=PLC4wuUniRn-BHsORPCu9vtU-43NArfl3d&index=1
// https://www.youtube.com/watch?v=4ZCy1AK7x4I
// https://www.tutorialspoint.com/firebase/firebase_overview.html