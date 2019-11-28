{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator
        var isGoingUp = true;
        var goingUpRequests = {};
        var goingDownRequests = {};
        var buttonPressRequests = {};

        elevator.on("idle", function() {
            startHeadingInOneDirection(elevator, isGoingUp);
        });
        elevator.on("stopped_at_floor", (floorNum) => {
            // Remove requests from the request map based on isGoingUp
            console.log(goingDownRequests);
            buttonPressRequests[floorNum] = false;
            if (isGoingUp) {
                goingUpRequests[floorNum] = false;
            } else {
                goingDownRequests[floorNum] = false;
            }

            // If we're at the bottom/top, switch the isGoingUp direction
            if (floorNum === 0) {
                isGoingUp = true;
            } else if (floorNum === floors.length - 1) {
                isGoingUp = false;
            }
            startHeadingInOneDirection(elevator, isGoingUp);
        });
        elevator.on("passing_floor", function (floorNum) {
            if (peopleWantElevatorToStopHere(elevator, floorNum, isGoingUp)) {
                elevator.stop();
                elevator.goToFloor(floorNum);
            }
        });
        elevator.on("floor_button_pressed", (floorNum) => buttonPressRequests[floorNum] = true);
        floors.forEach((floor) => {
            floor.on("up_button_pressed", (floor) => goingUpRequests[floor.floorNum()] = true);
            floor.on("down_button_pressed", (floor) => goingDownRequests[floor.floorNum()] = true);
        });
        function peopleWantElevatorToStopHere(elevator, floorNum, isGoingUp) {
            return buttonPressRequests[floorNum] || (isGoingUp && goingUpRequests[floorNum]) || (!isGoingUp && goingDownRequests[floorNum]);
        }
        function startHeadingInOneDirection(elevator, isGoingUp) {
            setLights(elevator, isGoingUp);
            elevator.goToFloor(isGoingUp ? floors.length - 1 : 0);
        }

        function setLights(elevator, isGoingUp) {
            elevator.goingUpIndicator(isGoingUp);
            elevator.goingDownIndicator(!isGoingUp);
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
