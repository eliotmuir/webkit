if (!user){
   var user = {}
}

user.logout=function(App){
   $.get("logout", {}, function(R){
      App.router().stop();
      App.clearSessionTimer();
      user.login(App);
   });
}

user.createLogout = function(App){
   $('#logout').click(function() { user.logout(App); });
//   App.projectModel().addView(new framework.view("logout", function() { $('#UserName').html(App.userName()); }));
//   App.projectModel().update();
}
