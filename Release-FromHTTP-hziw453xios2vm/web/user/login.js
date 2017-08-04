if (!user){
   var user = {}
}

user.login=function(App){
   var Model = {}
   console.log("user.login");
   var Data = {}
   App.setBody(Mustache.render(App.templateTable()["/user/login.html"], Model));  
   $("#signup").click(function(){ user.create(App); });
   
   $("#login").click(function(){
      Data.Email = $("input#email").val();
      Data.Password = $("input#password").val();

      $.post("login", Data, function(R){
         console.log(R);
         if (!R.success){
            $(".error").show().html(R.message);   
         } else {
            console.log("Current hash: ", document.location.hash);
            // store the session ID
            $(".error").hide();
            document.cookie ="session="+R.data.SessionId
            console.log("Session = ", R.data.SessionId);
            App.setUserName(R.data.Name);
            App.initSessionTimer(R.data.refreshTime, App);
            App.router().start();  // start routing 
            // TODO - we could set information on the application object to show who we are logged in as.
         }
      });
   });
   
   $(document).keypress(function(e){
      if(e.which == 13){
         $("#login").click();
      }
   });
}