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
                        icon: 'https://i.imgur.com/7HRAsbK.png',
                        id: markers[i].id
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        var markerID = this.id;


                        var foundMarkerID = _.find(markers, function(o) { 
                        	// console.log(o); 

                        	return o.id === markerID; 
                        });

                        // console.log(foundMarkerID)

                        localStorage.setItem('catProfile',JSON.stringify(foundMarkerID));
                        window.location.href = "catInfo.html";




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
// https://www.w3schools.com/js/js_loop_for.asp
// https://developers.google.com/maps/documentation/javascript/examples/marker-symbol-predefined
// https://getbootstrap.com/docs/3.3/css/#grid
// https://developers.google.com/maps/documentation/javascript/error-messages#api-not-activated-map-error
// https://developers.google.com/maps/documentation/javascript/infowindows
// https://www.youtube.com/watch?v=z3HD_1qA8Jc&list=PLC4wuUniRn-BHsORPCu9vtU-43NArfl3d&index=1
// https://www.youtube.com/watch?v=4ZCy1AK7x4I
// https://www.tutorialspoint.com/firebase/firebase_overview.html