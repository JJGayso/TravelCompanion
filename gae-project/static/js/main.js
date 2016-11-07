$(document).ready(function () {
    $(window).off("resize");
    mdlInitializations();
    enableButtons();
    $(".mdl-layout-title").on("click", function () {
        if (window.location.href.split('/').pop() !== "") {
            window.location.href = '/';
        }
    });
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

enableButtons = function () {
    $(".create-route-btn")
        .click(
            function () {
                console.log("Create");
                $('#create-route-button').html("Create Route");
                $("#edit-route-title").html("Create Route");
                document.querySelector('#edit-route-dialog').showModal();
                var stop1 = $(this).find(".stop1").html();
                var stop2 = $(this).find(".stop2").html();
                var stop3 = $(this).find(".stop3").html();
                var stop4 = $("#stop4").html();
                var stop5 = $("#stop5").html();
                
                
                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#stop1-field').MaterialTextfield
                    .change(stop1);
                document.querySelector('#stop2-field').MaterialTextfield
                    .change(stop2);
                document.querySelector('#stop3-field').MaterialTextfield
                    .change(stop3);
                document.querySelector('#stop4-field').MaterialTextfield
                	.change(stop4);
                document.querySelector('#stop5-field').MaterialTextfield
                	.change(stop5);
                
            }
        );

    //var stop1 = $('div[name=stop1').html();
    $(".edit-route-btn")
        .click(
            function () {
                console.log("Edit");
                $('#create-route-button').html("Edit Route");
                $("#edit-route-title").html("Edit Route");
                var entity_key = $('div[name=entity_key]').html()
                console.log(entity_key);

                document.querySelector('#edit-route-dialog').showModal();
                var stop1 = $("#stop1").html();
                var stop2 = $("#stop2").html();
                var stop3 = $("#stop3").html();
                var stop4 = $("#stop4").html();
                var stop5 = $("#stop5").html();

                document.querySelector('#stop1-field').MaterialTextfield
                    .change(stop1);
                document.querySelector('#stop2-field').MaterialTextfield
                    .change(stop2);
                document.querySelector('#stop3-field').MaterialTextfield
                    .change(stop3);
                document.querySelector('#stop4-field').MaterialTextfield
                    .change(stop4);
                document.querySelector('#stop5-field').MaterialTextfield
                    .change(stop5);

                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287


                if (entity_key != "") {
                    var stop1_text = $('div[name=stop1]').html();
                    var stop2_text = $('div[name=stop2]').html();
                    var stop3_text = $('div[name=stop3]').html();
                    var stop4_text = $('div[name=stop4]').html();
                    var stop5_text = $('div[name=stop5]').html();
                    stop1 = stop1_text;
                    stop2 = stop2_text;
                    stop3 = stop3_text;
                    stop4 = stop4_text;
                    stop5 = stop5_text;
                    document.querySelector('#stop1-field').MaterialTextfield
                        .change(stop1);
                    document.querySelector('#stop2-field').MaterialTextfield
                        .change(stop2);
                    document.querySelector('#stop3-field').MaterialTextfield
                        .change(stop3);
                    document.querySelector('#stop4-field').MaterialTextfield
                        .change(stop4);
                    document.querySelector('#stop5-field').MaterialTextfield
                        .change(stop5);
                }
            });

    $('#create-route-form').submit(function() {
    	var stop1_ordered = $('input[name=stop1-checkbox]').is(':checked');
        var stop2_ordered = $('input[name=stop2-checkbox]').is(':checked');
        var stop3_ordered = $('input[name=stop3-checkbox]').is(':checked');
        var stop4_ordered = $('input[name=stop4-checkbox]').is(':checked');
        var stop5_ordered = $('input[name=stop5-checkbox]').is(':checked');
        console.log("Status " + stop1_ordered);
    	
    	var ordered = [];
    	ordered.push(stop1_ordered);
    	ordered.push(stop2_ordered);
    	ordered.push(stop3_ordered);
    	ordered.push(stop4_ordered);
    	ordered.push(stop5_ordered);
    	
    	var route = [];
    	stop1_val = $('input[name=stop1]').val();
    	stop2_val = $('input[name=stop2]').val();
    	stop3_val = $('input[name=stop3]').val();
    	stop4_val = $('input[name=stop4]').val();
    	stop5_val = $('input[name=stop5]').val();
    	
        route.push(stop1_val);
        route.push(stop2_val);
        if (stop3_val != "") {
        	route.push(stop3_val);
        }
		if (stop4_val != "") {
			route.push(stop4_val);
		}
		if (stop5_val != "") {
			route.push(stop5_val);
		}
		
		var permutations = findPermutations(route, ordered);
		var times = [];
		for (var perm_index in permutations) {
			console.log(permutations[perm_index]);
			calculateRoute(times, permutations[perm_index], setTime);

		}
		sleep(3);
		return true;
    });
    
    
    //Save Route
    $('a[name=save-route-link]').click(function() {
    	var entity_key = $('div[name=entity_key]').html()
    	if (entity_key != "") {
    		$('input[name=save_entity_key]').val(entity_key);
    	}
    });
    
    // Password cancel button to close the insert-password-dialog
    $('.close-edit-route-dialog').click(function () {
        document.querySelector('#edit-route-dialog').close();
    });

    $(".share-btn")
        .click(
            function () {
                document.querySelector('#share-dialog').showModal();
                var contact = $(this).find(".contact").html();

                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#contact-field').MaterialTextfield
                    .change(contact);
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-share-dialog').click(function () {
        document.querySelector('#share-dialog').close();
    });

    $("#text-toggle").click(function () {
        if (!$(this).hasClass("mdl-button--colored")) {
            $(this).addClass("mdl-button--colored");
            $("#email-toggle").removeClass("mdl-button--colored");
            $("#contact-label").text("Phone Number");
        }
    });

    $("#email-toggle").click(function () {
        if (!$(this).hasClass("mdl-button--colored")) {
            $(this).addClass("mdl-button--colored");
            $("#text-toggle").removeClass("mdl-button--colored");
            $("#contact-label").text("Email Address");
        }
    });

    $(".recent-btn")
        .click(
            function () {
                document.querySelector('#recent-dialog').showModal();
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-recent-dialog').click(function () {
        document.querySelector('#recent-dialog').close();
    });
    function showSaveModal() {
        document.querySelector('#save-route-dialog').showModal();
    }

    function closeSaveModal() {
        document.querySelector('#save-route-dialog').close();
    }

    $(".save-route-btn")
        .click(
            function () {
                document.querySelector('#save-route-dialog').showModal();
                var name = $(this).find(".name").html();
                var time = $(this).find(".notification-time").html();
                // Note that I had to use change the mdl way to get the input label to float up.
                // See: https://github.com/google/material-design-lite/issues/1287
                document.querySelector('#name-field').MaterialTextfield
                    .change(name);
                document.querySelector('#notification-time-field').MaterialTextfield
                    .change(time);

                var dateinput = $('input[name=notification-time]');
                dateinput.bootstrapMaterialDatePicker({
                    format: 'hh:mm A',
                    shortTime: true,
                    date: false
                });
                dateinput.on("click", closeSaveModal);
                dateinput.on("beforeChange", function () {
                    document.querySelector('#save-route-dialog').showModal();
                    $("#notification-time-field").addClass("is-dirty");
                });
                $(".dtp-close").on("click", showSaveModal);
                $(".dtp-btn-cancel").on("click", showSaveModal);
            });

    // Password cancel button to close the insert-password-dialog
    $('.close-save-route-dialog').click(function () {
        document.querySelector('#save-route-dialog').close();
        var dateInput = $('input[name=notification-time]');
        dateInput.off("click", closeSaveModal);
        dateInput.off("beforeChange");
        $(".dtp-btn-cancel").off("click", showSaveModal);
        $(".dtp-close").off("click", showSaveModal);
    });

    $(".my-routes-btn")
        .click(
            function () {
                document.querySelector('#my-routes-dialog').showModal();
            });

    $('.close-my-routes-dialog').click(function () {
        document.querySelector('#my-routes-dialog').close();
    });
};

mdlInitializations = function () {
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
    var stop1 = $('div[name=stop1]').html();
    var stop2 = $('div[name=stop2]').html();
    var stop3 = $('div[name=stop3]').html();
    var stop4 = $('div[name=stop4]').html();
    var stop5 = $('div[name=stop5]').html();

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

    if (window.location.href.split('/').pop() == "login") {
        var control = document.getElementById('floating-panel');
        control.style.display = 'block';
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
        var onChangeHandler = function () {
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
                }, function (response, status) {
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
                }, function (response, status) {
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
                        }, {
                            location: stops[2],
                            stopover: true
                        }],
                    travelMode: 'DRIVING'
                }, function (response, status) {
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
                        }, {
                            location: stops[2],
                            stopover: true
                        }, {
                            location: stops[3],
                            stopover: true
                        }],
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }
        } else {
            $("#right-panel").addClass("hidden");
            $("#map").css("width", "100%");
        }
    }
    sleep(0);
    $("#map").css("height", $(".mdl-layout__content").height());
    $("#right-panel").css("height", $(".mdl-layout__content").height());

    $(window).resize(function () {
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
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function calculateRoute(times, route, callback) {
//	var origin = new google.maps.LatLng( location.latitude, location.longitude ); // using google.maps.LatLng class
//	var destination = target.latitude + ', ' + target.longitude; // using string

	
	
	if (route.length < 3) {
		var request = {
		    origin: route[0], // LatLng|string
		    destination: route[route.length - 1], // LatLng|string
		    travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
	} else if (route.length == 3) {
		var request = {
			    origin: route[0], // LatLng|string
			    destination: route[route.length - 1], // LatLng|string
			    waypoints: [
	                        {
	                            location: route[1],
	                            stopover: true
	                        }],
			    travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
	} else if (route.length == 4) {
		var request = {
			    origin: route[0], // LatLng|string
			    destination: route[route.length - 1], // LatLng|string
			    waypoints: [
	                        {
	                            location: route[1],
	                            stopover: true
	                        }, {
	                            location: route[2],
	                            stopover: true
	                        }],
			    travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
	} else {
		var request = {
			    origin: route[0], // LatLng|string
			    destination: route[route.length - 1], // LatLng|string
			    waypoints: [
	                        {
	                            location: route[1],
	                            stopover: true
	                        }, {
	                            location: route[2],
	                            stopover: true
	                        }, {
	                            location: route[3],
	                            stopover: true
	                        }],
			    travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
	}
	getTime(route, times, request, callback);

	
}

function findPermutations(route, ordered) {
	console.log(ordered);
	var ordered_count = 0;
	for (var i = 0; i < route.length; i++) {
		if (ordered[i] == true) {
			ordered_count += 1;
		}
	}
	console.log(ordered_count);
	
	var perms = [];
	
	if (ordered_count == route.length) {
		perms.push(route);
		return perms;
	} else {
		perms = permutator(route);
		var final_perms = [];
		for (var perm_num in perms) {
			var meet_check = true;
			for (var index = 0; index < route.length; index++) {
				if (ordered[index] == true && perms[perm_num][index] != route[index]) {
					meet_check = false;
				}
			}
			if (meet_check) {
				final_perms.push(perms[perm_num]);
			}
		}
		console.log("DONE");
		return final_perms;
	}
}

function permutator(inputArr) {
	  var results = [];

	  function permute(arr, memo) {
	    var cur, memo = memo || [];

	    for (var i = 0; i < arr.length; i++) {
	      cur = arr.splice(i, 1);
	      if (arr.length === 0) {
	        results.push(memo.concat(cur));
	      }
	      permute(arr.slice(), memo.concat(cur));
	      arr.splice(i, 0, cur[0]);
	    }

	    return results;
	  }

	  return permute(inputArr);
}

function getTime(route, times, request, callback) {
	var directionsService = new google.maps.DirectionsService();
	var value  = 0;
	directionsService.route( request, function( response, status ) {
		console.log(status);
	    if ( status === 'OK' ) {
	        var point = response.routes[ 0 ].legs[ 0 ];
	        console.log(point.duration.text);
	        console.log(point.distance.value);
	        value = point.distance.value;
	        callback(route, times, value);
	    }
	})
}

function setTime(route, times, time) {
	times.push(time);
	if (times.length == route.length) {
		finishCalculation()
	}
}

function finishCalculation(times) {
	var index = 0;
	var smallest = times[0];
	for (var i = 1; i < times.length; i++) {
	  if (times[i] < smallest) {
	    smallest = times[i];
	    index = i;
	  }
	}
	
	console.log(index);
}





