angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            // route for the rooms pages
            .when("/", {
                templateUrl: "rooms/room_list.html",
                controller: "FrontPageController",
                resolve: {
                    rooms: function(RoomsService) {
                        return RoomsService.getRooms();
                    }
                }
            })
            .when('/rooms/:roomId', {
              templateUrl : 'rooms/room_temp.html',
              controller  : 'MoveController',
              resolve: {
                rooms: function(RoomsService) {
                  console.log("rooms resolve happens");
                  return RoomsService.getRooms();
                }
              }
            })
            .otherwise({
                redirectTo: "/"
            })
    })
// Retrieves the Room information from the database
    .service("RoomsService", function($http) {
      console.log("RoomsService online");
        this.getRooms = function() {
            return $http.get("/rooms").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding rooms.");
                });
        }
    })

// Controls the entrance page
    .controller("FrontPageController", function($scope, $routeParams, $location){
      console.log("FrontPageController online");
    })

// Begins the major controller
    .controller("MoveController", function($scope, $routeParams, rooms, $location, RoomsService)  {
      console.log("rooms", rooms);
      $scope.rooms = rooms.data;
      $scope.room_num = parseInt($routeParams.roomId, 10);

// Scopes the current room
      if ($scope.rooms.roomName = $routeParams.roomId){
        for ( prop in $scope.rooms ) {
          if (roomsData[prop].roomName === "room"+roomsData.roomName){
            //Current room
            $scope.thisRoom = roomsData[prop];
          }
        }
      }

// Item box binding
      $scope.showSelectedText = function() {
        $scope.selectedText =  $scope.getSelectionText();
      };

      $scope.getSelectionText = function() {
        var text = "";
        if (window.getSelection) {
          text = window.getSelection().toString();
          for ( image in $scope.thisRoom.itemImages) {
            if (image === text){
              $scope.thisItemImage = $scope.thisRoom.itemImages[image].file;
              $scope.thisItemDesc = $scope.thisRoom.itemImages[image].description;
              break;
            } else {
              $scope.thisItemImage = "../images/question.png";
              $scope.thisItemDesc = "";
            }
          }
          if ($scope.thisItemImage === undefined){
            document.getElementById("item-image").src = "../images/question.png";
          } else {
            document.getElementById("item-image").src= $scope.thisItemImage;
            document.getElementById("item-image-desc").src= $scope.thisItemDesc;
          }
        } else if (document.selection && document.selection.type != "Control") {
            document.getElementById("item-image").src="../images/question.png";
            text = document.selection.createRange().text;
        }
        return text;
      };
      // End Item box bindings

      document.getElementById("primaryInputBox").focus();
      // This receives all input in the primaryInputBox
        $scope.inputFunc = function(text) {
          var thisRoomNumber = $routeParams.roomId;
          for ( prop in roomsData ) {
            // var lights = roomsData[prop].lights;
            // $scope.lights;

            if (roomsData[prop].roomName === "room"+thisRoomNumber){
              // This controls all available directions in the entire game.
              // The grid is plus/minus 1 horizontal & plus/minus 10 vertical.
              // The grid must change for wider than 20 rooms across.
              // In other words, +100 or +1000 when moving north, etc.

              // It also controls all the items in a room desc.
              // Likely the directions will be thrown into arrays later.

              //Actions
              var itemActions = roomsData[prop].itemActions;

              function flipSwitch(dial) {
                $scope.gameMessage = dial.text;
                dial.status = !dial.status
              ////////////
                // some kind of update function that sends the dial directly to the DB. ideally ONLY the boolean.
                RoomsService.editRoom($scope.thisRoom);

              ////////////
              }

              // Find the directions in the database.
              var northValue = roomsData[prop].exit.north;
              var southValue = roomsData[prop].exit.south;
              var eastValue = roomsData[prop].exit.east;
              var westValue = roomsData[prop].exit.west;

              //Alternate keys for same directions
              var northKey = (text === 'north' || text === 'n');
              var southKey = (text === 'south' || text === 's');
              var eastKey = (text === 'east' || text === 'e');
              var westKey = (text === 'west' || text === 'w');
              // Error handling for blanks.
              if (text === undefined){
                text = " ";
                $scope.gameMessage = "What are you trying to do?";
                return;
              }
              var splitCmd = text.split(' ');
              var cmdKey = splitCmd[0];
              var prepositionsBlackList = "at" || "the" || "a"
              var objectKey;
              // Syntax handling for prepositions
              // For 'look at the bear', 'look at bear', & 'look bear'
              if (splitCmd.length > 1) {
                if (splitCmd.length >= 4) {
                  objectKey = splitCmd[3];
                  $scope.objectKey = objectKey;
                } else if (splitCmd.length === 3) {
                  objectKey = splitCmd[2];
                  $scope.objectKey = objectKey;
                } else if (splitCmd.length = 2) {
                  objectKey = splitCmd[1];
                  $scope.objectKey = objectKey;
                }
              }
                // If the input matches a possible direction from the database
              if (northKey && northValue === true){
                var newRoom = (room_num + 10).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (southKey && southValue === true){
                var newRoom = (room_num - 10).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (eastKey && eastValue === true){
                var newRoom = (room_num + 1).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (westKey && westValue === true){
                var newRoom = (room_num - 1).toString();
                $location.path('rooms/' + newRoom);
                return;
              // } else if (text === "push button"){
              //   $scope.lights = !$scope.lights;
              //   if ($scope.lights === true) {
              //     document.getElementById("largeToyBox").style.border = "thick solid #0000FF";
              //   }
              //   if ($scope.lights === false){
              //     document.getElementById("largeToyBox").style.border = "";
              //   }
              } else if (text){
                for (action in itemActions) {
                  for (object in itemActions[action]){
                    if (action === cmdKey && object === objectKey ){
                        var dial = itemActions[action][object];
                        flipSwitch(dial)
                    }
                  }
                }
              } else {
                $scope.gameMessage = "You can't do that.";
                document.getElementById("primaryInputBox").value=null;
                return;
              }

            }
          }
        }
      });
