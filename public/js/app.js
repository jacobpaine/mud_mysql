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

// Scopes the current room's properties
      if (roomsData.roomName = $routeParams.roomId){
        for ( prop in roomsData ) {
          if (roomsData[prop].roomName === "room"+roomsData.roomName){
            //Current room
            $scope.thisRoom = roomsData[prop];
            $scope.roomImage = roomsData[prop].room_image;
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

      function movePlayer(num){
        // This handles the player moving in normal XYZ coordinates.
        console.log("number", number);
      }

      // This receives all User's typed input
        $scope.inputFunc = function(text) {
          // All input must be toLowerCase
          text = text.toLowerCase();

          // Error handling for blanks.
          if (text === undefined){
            text = " ";
            $scope.gameMessage = "What are you trying to do?";
            return;
          }

          var thisRoomNumber = $routeParams.roomId;
          for ( prop in roomsData ) {
            // console.log("roomsData[prop].roomName", roomsData[prop].roomName);
            // console.log("other", "room"+thisRoomNumber);


//Actions
              // Find the directions in the database.
              var northValue = roomsData[prop].north;
              var southValue = roomsData[prop].south;
              var eastValue = roomsData[prop].east;
              var westValue = roomsData[prop].west;

              var northKey = (text === 'north' || text === 'n');
              var southKey = (text === 'south' || text === 's');
              var eastKey = (text === 'east' || text === 'e');
              var westKey = (text === 'west' || text === 'w');

// Parsing text commands
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
      // Matching text commands to room commands
                // Iterate through every room's actions
                var totalCmds = 0;
                var totalInv = 0;
                var badInvCount = 0;
                var badCmdCount = 0;
                // $.each(actionsData, function(index, roomActions){
                //   console.log("actionsData roomActions", roomActions);
                //   //Amidst all rooms, finding this one's actions
                //   if (roomActions.roomName === $scope.thisRoom.roomName){
                //     totalInv++;
                //     //Parsing this room_actions cols
                //     console.log("Object.keys(roomActions)", Object.keys(roomActions));
                //     $.each(Object.keys(roomActions), function(index, roomActionsCol) {
                //
                //       // console.log("roomActions", roomActions);
                //       totalCmds = Object.keys(roomActions).length;
                //       // // Keys to be counted for all the rooms that don't work.
                //
                //       if (cmdKey.match(roomActionsCol)){
                //         console.log("match");
                //         console.log("cmdKey", cmdKey);
                //         console.log("roomActionsCol", roomActionsCol);
                //       };
                //
                //       if (cmdKey === roomActionsCol) {
                //         // If the obj in the room matches the obj input
                //         if(roomActions.inv === objectKey) {
                //           var response = roomActions[roomActionsCol];
                //           actOnObj(cmdKey, objectKey, response);
                //         } else if (roomActions.inv !== objectKey) {
                //           badInvCount++;
                //           if (badInvCount === totalInv) {
                //             actOnWrongObj(cmdKey, objectKey);
                //           }
                //         }
                //       } else if (cmdKey !== roomActionsCol){
                //         badCmdCount++
                //         if (badCmdCount === totalCmds) {
                //           actOnWrongCmd(cmdKey, objectKey);
                //         }
                //       }
                //     })
                //   }
                // })
              }
              document.getElementById("primaryInputBox").value=null;


            function actOnObj(cmd, obj, res) {
              $scope.gameMessage = res;
              console.log("RIGHT!");
              return;
            }

            function actOnWrongCmd(cmd, obj) {
              console.log("Wrong CMD count reached");
              if (cmd === undefined) {
                $scope.gameMessage = cmd + " what?"
              } else {
                errMsg= cmd.charAt(0).toUpperCase();
                cmd = cmd.slice(1);
                cmd = errMsg + cmd;
                console.log("WRONG", cmd);
                $scope.gameMessage = cmd + " what?"
              }
              console.log("WrongCmd in wrongcmd", cmd);
              console.log("WrongObj in wrongcmd", obj);
              return;
            }

            function actOnWrongObj(cmd, obj) {
              console.log("Wrong Obj count reached");
              if (obj === undefined) {
                $scope.gameMessage = "You're going to have to be more specific."
              } else {
                $scope.gameMessage = " I don't detect ..." + obj +"?"
              }
              return;
            }


          }
        }
      });
