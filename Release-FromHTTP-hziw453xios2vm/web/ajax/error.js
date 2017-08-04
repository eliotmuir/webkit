if (!ajax){
   var ajax = {}  
}

ajax.registerErrorHandler = function(App){
   console.log("Register error handler.");
   $(document).ajaxError(function(event, Info, ajaxSettings, thrownError){
      console.log("Ajax error encountered.");
      console.log(thrownError);
      console.log(Info);
      console.log(event);
      console.log(ajaxSettings);
      var R = Info.responseJSON;
      if (R && R.message) {
         error.dialog(App, R.message + " Please check your network connection?");
      } else {
         error.dialog(App, "Error trying to connect to server.  Please check your network connection?"); 
      }
   });
   
   $(document).ajaxComplete(function(event, Info, ajaxSettings){
      //console.log(event, jqXHR, ajaxSettings);
      var R = Info.responseJSON;
      if (!R.success && R.message === "Invalid session"){  // TODO a little bit fragile in our checking
         user.logout(App);
      }
   });
}