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
    .service("RoomsService", function($http, $q) {
      console.log("RoomsService online");
      this.getRooms = function() {
        var rooms = $http.get("/rooms");
        var actions = $http.get("/room_actions");
            return $q.all([rooms, actions]).then(function(response){
              return response;
            }, function(response) {
              console.log("Error!", response);
          });
        }
        // this.getRooms = function() {
        //     return $http.get("/rooms").
        //         then(function(response) {
        //           console.log("RESPONSE", response);
        //             return response;
        //         }, function(response) {
        //             alert("Error finding rooms.");
        //         });
        // }
        this.editRoom = function(room) {
          console.log("room", room);
          var url = "/rooms/" + room._id;
          console.log("url", url);
          return $http.put(url, room).
              then(function(response) {
                  return response;
              }, function(response) {
                  alert("Error editing this room.");
                  console.log(response);
              });
        }
    })

    .controller("FrontPageController", function($scope, $routeParams, $location){
      console.log("FrontPageController online");
    })

    .controller("MoveController", function($scope, $routeParams, rooms, $location, RoomsService)  {
      var roomsData = rooms[0].data;
      var actionsData = rooms[1].data;
      var room_num = parseInt($routeParams.roomId, 10);

      console.log("roomsData", roomsData);
      console.log("actionsData", actionsData);

      $scope.rooms = roomsData;
      $scope.room_num = room_num;
      $scope.actions = actionsData;

// Scopes the current room
      if (roomsData.roomName = $routeParams.roomId){
        for ( prop in roomsData ) {
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

// Start primary Input box code (User's text input)
      document.getElementById("primaryInputBox").focus();
      // This receives all User's typed input
        $scope.inputFunc = function(text) {
          var thisRoomNumber = $routeParams.roomId;
          for ( prop in roomsData ) {
            if (roomsData[prop].roomName === "room"+thisRoomNumber){
              // This controls all available directions in the entire game.
              // The grid is plus/minus 1 horizontal & plus/minus 10 vertical.
              // The grid must change for wider than 20 rooms across.
              // In other words, +100 or +1000 when moving north, etc.

              // It also controls all the items in a room desc.
              // Likely the directions will be thrown into arrays later.


//Actions
              // Find the directions in the database.
              var northValue = roomsData[prop].north;
              var southValue = roomsData[prop].south;
              var eastValue = roomsData[prop].east;
              var westValue = roomsData[prop].west;

              //Alternate keys for (var i = 0; i < array.length; i++) {
              //   array[i]
              // } same directions
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
              if (northKey && northValue === 1){
                console.log("North?");
                var newRoom = (room_num + 10).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (southKey && southValue === 1){
                var newRoom = (room_num - 10).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (eastKey && eastValue === 1){
                var newRoom = (room_num + 1).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (westKey && westValue === 1){
                var newRoom = (room_num - 1).toString();
                $location.path('rooms/' + newRoom);
                return;
              } else if (text){
                $.each(actionsData, function(index, value){
                  // if (value.roomName === $scope.thisRoom.roomName && )

                  console.log("index", index);
                  console.log("value", value);

                  console.log("cmdKey", cmdKey);
                  console.log("objectKey", objectKey);
                  console.log("value Object.keys", Object.keys(value));
                  console.log("value Object.values", Object.values(value));

                })
                for (action in actionsData) {
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
              //Actions available in the room

// Actions that update
// var itemActions = roomsData[prop].itemActions;
//
// function flipSwitch(dial) {
// $scope.gameMessage = dial.text;
// dial.status = !dial.status
// ////////////
// // some kind of update function that sends the dial directly to the DB. ideally ONLY the boolean.
// RoomsService.editRoom($scope.thisRoom);
//
// ////////////
// }
// //Actions that emote
// console.log("$scopeActions", $scope.actions);
// console.log("cmdKey", cmdKey);
// console.log("objectKey", objectKey);


            }
          }
        }
      });
