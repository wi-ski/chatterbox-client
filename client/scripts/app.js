// YOUR CODE HERE:
var entityMap = {
   "&": "&amp;",
   "<": "&lt;",
   ">": "&gt;",
   '"': '&quot;',
   "'": '&#39;',
   "/": '&#x2F;'
 };

 function escapeHtml(string) {
   return String(string).replace(/[&<>"'\/]/g, function (s) {
     return entityMap[s];
   });
 }




app = {};
session = {};



$(document).ready(function(){
  session.roomname="TESTROOM"
  var msg_board = $(".msg_board");

  $(".userMessage").keypress(function(e) {
    var $this = $(this)
    if(e.which == 13) {
      if($.trim($this.val()) !== ""){
        app.send($this.val());
      }
      $this.val("");
    }

  });



  app.clear = function(){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log(data)
        data.results.forEach(function(entry,i){
          app.deleteMsg(entry.objectId)
        })
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message',data);
      }
    });



  }


  app.deleteMsg = function(msgKey){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox/'+msgKey,
      type: 'DELETE',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent',data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message',data);
      }
    });
  }

  app.loginUser = function(userName,pwd){ //TESNAME PWDPWDPWD
    $.ajax({
      type: "GET",
      url:"https://api.parse.com/1/login",
      data:{
          username:userName,
          password:pwd
        }
    }).done(function(e) {
      console.log("REQ DONE ",e)
    }).success(function(e){
      session.sessionToken = e.sessionToken;
      session.objectID = e.objectId; 
      session.userName = e.username;
      console.log("SUCESS",e);
      }).error(function(e){
      console.log(e)
    }) 
  }
  
  app.recieve = function(){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log("Successssss: ",data)
        data.results.forEach(function(entry){
          msg_board.empty();
          var $thing = $("<li>"+escapeHtml(entry.text)+"</li>");
          $thing.attr("data",JSON.stringify(entry))
          $thing.on("click",function(e){
            app.deleteMsg(JSON.parse($(this).attr("data")).objectId);
          })
          setTimeout(function(){msg_board.append($thing)},1000);
        })
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message',data);
      }
    });
  }

  app.send = function(message){
    var messageObj={
      username: session.userName,
      text: message,
      roomname: session.roomname
    }
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(messageObj),
      contentType: 'application/json',
      success: function (data) {
        console.log('Sucessss: Message sent',data);
        app.recieve();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message',data);
      }
    });
  }

  app.deleteUser=function(objectID){
    $.ajax({
      type: "DELETE",
      url:"https://api.parse.com/1/users/"+objectID,
      headers:{"X-Parse-Session-Token":session.sessionToken}
    }).done(function(e) {
      console.log("REQ DONE ",e)
    }).success(function(e){
      console.log("SUCESS",e);
      }).error(function(e){
      console.log(e)
    })
  }

  app.init = function(){
  $.ajax({
    type: "GET",
    url:"https://api.parse.com/1/users"
  }).done(function(e) {
    console.log("REQ DONE ",e)
  }).success(function(e){
    e.results.forEach(function(userObj){
      users_listing.append("<li>"+ (userObj.username) +"</li>")
    })


  }).error(function(e){
    console.log(e)
  }) 
  }

  app.genUser = function(username,password){
    $.ajax({
      type:"POST",
      url:"https://api.parse.com/1/users",
      data:JSON.stringify({
        username:username,
        password:password
      })
    }).done(function(e){
      console.log("REQUEST GENERATED ",e)
    }).success(function(e){
      console.log("SUCCESS",e)

    }).error(function(e){
      console.log("FAILURE",e)
    })
  }


})
