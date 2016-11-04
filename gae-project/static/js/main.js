$(document).ready(function() {
    $(window).off("resize");
    mdlInitializations();
    enableButtons();
    $(".mdl-layout-title").on("click", function() {
        if(window.location.href.split('/').pop() !== "") {
            window.location.href = '/';
        }
    });
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

enableButtons = function() {
    $(".edit-route-btn")
        .click(
            function() {
                document.querySelector('#edit-route-dialog').showModal();
                var stop1 = $(this).find(".stop1").html();
                var stop2 = $(this).find(".stop2").html();
                var stop3 = $(this).find(".stop3").html();

                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#stop1-field').MaterialTextfield
                    .change(stop1);
                document.querySelector('#stop2-field').MaterialTextfield
                    .change(stop2);
                document.querySelector('#stop3-field').MaterialTextfield
                    .change(stop3);
            });

    // Create Route and Place on Map
    $('#create-route-button').click(function() {
    	var stop1 = $('#edit-route-dialog input[name=stop1]').val();
    	var stop2 = $('#edit-route-dialog input[name=stop2]').val();
    	var stop3 = $('#edit-route-dialog input[name=stop3]').val();
    	var stop4 = $('#edit-route-dialog input[name=stop4]').val();
    	var stop5 = $('#edit-route-dialog input[name=stop5]').val();
    	
    	var stops = [];
    	stops.push(stop1);
    	stops.push(stop2);
    	if (stop3 != "" && stop3 != undefined) {
    		stops.push(stop3);
    	}
    	if (stop4 != "" && stop4 != undefined) {
    		stops.push(stop4);
    	}
    	if (stop5 != "" && stop5 != undefined) {
    		stops.push(stop5);
    	}
    	
    	initMap(stops);
    });
    
    // Password cancel button to close the insert-password-dialog
    $('.close-edit-route-dialog').click(function() {
        document.querySelector('#edit-route-dialog').close();
    });

    $(".share-btn")
        .click(
            function() {
                document.querySelector('#share-dialog').showModal();
                var contact = $(this).find(".contact").html();

                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#contact-field').MaterialTextfield
                    .change(contact);
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-share-dialog').click(function() {
        document.querySelector('#share-dialog').close();
    });

    $("#text-toggle").click(function(){
        if(!$(this).hasClass("mdl-button--colored"))
        {
            $(this).addClass("mdl-button--colored");
            $("#email-toggle").removeClass("mdl-button--colored");
            $("#contact-label").text("Phone Number");
        }
    });

    $("#email-toggle").click(function(){
        if(!$(this).hasClass("mdl-button--colored"))
        {
            $(this).addClass("mdl-button--colored");
            $("#text-toggle").removeClass("mdl-button--colored");
            $("#contact-label").text("Email Address");
        }
    });

    $(".recent-btn")
        .click(
            function() {
                document.querySelector('#recent-dialog').showModal();
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-recent-dialog').click(function() {
        document.querySelector('#recent-dialog').close();
    });
    function showSaveModal(){ document.querySelector('#save-route-dialog').showModal(); }
    function closeSaveModal() { document.querySelector('#save-route-dialog').close();}
    $(".save-route-btn")
        .click(
            function() {
                document.querySelector('#save-route-dialog').showModal();
                var name = $(this).find(".name").html();
                var time = $(this).find(".notification-time").html();
                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#name-field').MaterialTextfield
                    .change(name);
                document.querySelector('#notification-time-field').MaterialTextfield
                    .change(time);

                var dateinput= $('input[name=notification-time]');
                dateinput.bootstrapMaterialDatePicker({
                    format : 'hh:mm A',
                    shortTime : true,
                    date : false
                });
                dateinput.on("click", closeSaveModal);
                dateinput.on("beforeChange", function(){
                    document.querySelector('#save-route-dialog').showModal();
                    $("#notification-time-field").addClass("is-dirty");
                });
                $(".dtp-close").on("click", showSaveModal);
                $(".dtp-btn-cancel").on("click", showSaveModal);
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-save-route-dialog').click(function() {
        document.querySelector('#save-route-dialog').close();
        var dateInput = $('input[name=notification-time]');
        dateInput.off("click", closeSaveModal);
        dateInput.off("beforeChange");
        $(".dtp-btn-cancel").off("click", showSaveModal);
        $(".dtp-close").off("click", showSaveModal);
    });
}

mdlInitializations = function() {
    // Polyfill for browsers that don't support the dialog tag.
    var dialogs = document.querySelectorAll('dialog');
    for (var i = 0; i < dialogs.length; i++) {
        // Using an old school style for loop since this for compatibility.
        var dialog = dialogs[i];
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
    }
};

var map;
function initMap() {
	var user_email = $('div[name=user_email').html();
	var stop1 = $('div[name=stop1').html();
	var stop2 = $('div[name=stop2').html();
	var stop3 = $('div[name=stop3').html();
	var stop4 = $('div[name=stop4').html();
	var stop5 = $('div[name=stop5').html();

	var stops = [];
	if (stop1 != "" && stop1 != undefined) {
		stops.push(stop1);
	}
	if (stop2 != "" && stop2 != undefined) {
		stops.push(stop2);
	}
	if (stop3 != "" && stop3 != undefined) {
		stops.push(stop3);
	}
	if (stop4 != "" && stop4 != undefined) {
		stops.push(stop4);
	}
	if (stop5 != "" && stop5 != undefined) {
		stops.push(stop5);
	}
	
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    if(window.location.href.split('/').pop() == "login"){
        var control = document.getElementById('floating-panel');
        control.style.display = 'block';
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
        var onChangeHandler = function() {
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
    } else {
    	if (stops.length != 0) {
    		if (stops.length == 2) {
	    		directionsService.route({
	                origin: stops[0],
	                destination: stops[1],
	                travelMode: 'DRIVING'
	            }, function(response, status) {
	                if (status === 'OK') {
	                    directionsDisplay.setDirections(response);
	                } else {
	                    window.alert('Directions request failed due to ' + status);
	                }
	            });
    		}
    		else if (stops.length == 3) {
    			directionsService.route({
	                origin: stops[0],
	                destination: stops[2],
	                waypoints: [
	                            {
	                              location: stops[1],
	                              stopover: true
	                            }],
	                travelMode: 'DRIVING'
	            }, function(response, status) {
	                if (status === 'OK') {
	                    directionsDisplay.setDirections(response);
	                } else {
	                    window.alert('Directions request failed due to ' + status);
	                }
	            });
    		}
    		else if (stops.length == 4) {
    			directionsService.route({
	                origin: stops[0],
	                destination: stops[3],
	                waypoints: [
	                            {
	                              location: stops[1],
	                              stopover: true
	                            },{
	                              location: stops[2],
	                              stopover: true
	                            }],
	                travelMode: 'DRIVING'
	            }, function(response, status) {
	                if (status === 'OK') {
	                    directionsDisplay.setDirections(response);
	                } else {
	                    window.alert('Directions request failed due to ' + status);
	                }
	            });
    		}
    		else if (stops.length == 5) {
    			directionsService.route({
	                origin: stops[0],
	                destination: stops[4],
	                waypoints: [
	                            {
	                              location: stops[1],
	                              stopover: true
	                            },{
	                              location: stops[2],
	                              stopover: true
	                            },{
	                            	location: stops[3],
		                            stopover: true
	                            }],
	                travelMode: 'DRIVING'
	            }, function(response, status) {
	                if (status === 'OK') {
	                    directionsDisplay.setDirections(response);
	                } else {
	                    window.alert('Directions request failed due to ' + status);
	                }
	            });
    		}
    	} else {
	        directionsService.route({
	            origin: 'Rose-Hulman',
	            destination: 'Oklahoma City, OK',
	            waypoints: [
	                        {
	                          location: 'st louis, mo',
	                          stopover: true
	                        },{
	                          location: 'Joplin, MO',
	                          stopover: true
	                        }],
	            travelMode: 'DRIVING'
	        }, function(response, status) {
	            if (status === 'OK') {
	                directionsDisplay.setDirections(response);
	            } else {
	                window.alert('Directions request failed due to ' + status);
	            }
	        });
    	}
    }
    sleep(0);
    $("#map").css("height", $(".mdl-layout__content").height());
    $("#right-panel").css("height", $(".mdl-layout__content").height());

    $(window).resize(function() {
        $("#map").css("height", $(".mdl-layout__content").height());
        $("#right-panel").css("height", $(".mdl-layout__content").height());
        google.maps.event.trigger(map, "resize");
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}