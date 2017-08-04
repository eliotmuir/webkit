
var Application = function() {
   var m_Templates = {};
   var m_UserName = ''
   var m_Router = new Router();
   var m_SessionTimer = new SessionTimer();

   this.setUserName = function(V){
      m_UserName = V;  
   }
   
   this.setSessionTimerRefresh = function() {
      m_SessionTimer.toggleRefresh();
   }
   
   this.initSessionTimer = function(refreshTime, App) {
      m_SessionTimer.create(refreshTime, App, function() {
         $.get("refreshSession", {}, function(R) {
            console.log("Refreshing Session");
            console.log(R);
            if (!R.success){
               user.logout(App);
            }
         });
      });
   }
   
   this.clearSessionTimer = function () {
      m_SessionTimer.clear();
   }
   
   this.router = function() {
      return m_Router;  
   }
   
   this.setTemplateTable = function (V){
      m_Templates = V;
   }
   
   this.templateTable = function(){
     return m_Templates; 
   }
   
   this.setBody = function(Html){
      $('body').html(Html);
   }
   
    
   this.drawMain = function(Html){
      if ($('#content-target').length !== 1){
         console.log("Drawing in main view");
         var Model = {UserName : m_UserName}
         var MenuHtml = Mustache.render(this.templateTable()["/main.html"], Model);
         $('body').html(MenuHtml);
         $('#logout').click(function() { user.logout(App); });

         user.createLogout(App);
      }
      $('#content-target').html(Html);
      // make sure we are scrolled to the top.
   }
}

function CheckSession(App){
   console.log('Checking if Logged in');
   $.get("checkSession", {}, function(R){
      console.log("checkSession");
      console.log(R);
      if (R.success){
         // if it's not a success it will be picked up by our global AJAX handler.
         console.log(R.data.Name);
         App.initSessionTimer(R.data.ExpireTime, App);
         App.setUserName(R.data.Name); 
         App.router().start();
      }
   });   
}

function SetupRoutes(App){
   var Router = App.router();
   Router.route("",         function(){ main.start(App); });
   Router.setDefault( function(Page) { error.dialog(App, "Page " + Page + " is unknown."); });  
   Router.setHashChangeEvent(App.setSessionTimerRefresh);
}

$().ready(function(){
   console.log('Ready event');
   window.App = new Application();
   ajax.registerErrorHandler(window.App);
   SetupRoutes(App);
   template.load(function(TemplateTable){ App.setTemplateTable(TemplateTable); CheckSession(App); });
});