var app = {};


var Chat_post = Backbone.model.extend({
  
  // urlRoot:'https://api.parse.com/1/classes/chatterbox',
  urlRoot:'/chatterbox',

  defaults:{
    text:"No text in this message",
    username:"No UserName Provided",
  },

  initialize: function(){
    console.log("New Chat Post initialized");
    this.on("change:text",function(){
      console.log("Text changed for: ",this)
    });
  },

  // destroy:function(){

  //   //destroy the object
  // },
  
  // update:function(){

  //   //update the object
  // }

});


var User = Backbone.model.extend({

  initialize: function(){
    console.log("New User initialized")
  },

});