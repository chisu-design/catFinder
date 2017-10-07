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

//prepare database
var database = firebase.database();

function initMap() {

    database.ref('cat/').on("value", function(snapshot) {

        var markers = snapshotToArray(snapshot.val());

        //get gps coordinate
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
                        id: markers[i].id
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        var markerID = this.id;
                        
                        markers.find()

                    });

                }



            });
        } else {
            //execute code here if browser don't support geolocation
            x.innerHTML = "Geolocation is not supported by this browser.";
        }



    }, function(error) {
        console.log("Error: " + error.code);
    });

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


    $('#files').change(function(event) {
        files = event.target.files;
        console.log(files.length);
        $('#text-overlay').text(files.length);

    });


    $('#myForm').submit(function(event) {
        event.preventDefault();

        if (files.length > 0) {
            var possible = 'abcedfghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ0123456789',
                numOfChar = 20,
                uuid = '',
                images = [];

            for (c = 0; c < numOfChar; c++) {
                uuid += possible.charAt(Math.floor(Math.random() * possible.length));

            }

            for (i = 0, numOfFiles = files.length; i < numOfFiles; i++) {

                var imagePath = 'images/' + uuid + '/' + files[i].name;
                var storageRef = firebase.storage().ref(imagePath);

                var insertImage = function(snapshot) {

                    images.push(snapshot.metadata.downloadURLs[0]);

                    //insert data into firebase
                    if (images.length === numOfFiles) {
                        database.ref('cat').push({
                            id: uuid,
                            name: event.target.catName.value,
                            location: location,
                            images: images
                        });
                    }

                }

                storageRef.put(files[i]).then(insertImage);
                //go back to the homepage
                window.location.href = "index.html"

            }
        }




    });



});