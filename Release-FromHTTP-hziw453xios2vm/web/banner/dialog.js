if (!banner){
   var banner = {}  
}

banner.dialog = function(App, Message, Persist){
   var Model = {"Message" : Message};
   var Html = Mustache.render(App.templateTable()["/banner/dialog.html"], Model);
   // TODO - should we clear views?
   $('body').append(Html);
   $("div.closeBanner").click(function(){ 
      console.log("Click");
      $("div.bannerPanel").fadeOut('fast', function(){
         $(this).remove()
      });
   });
   if (!Persist) {
      setTimeout(function() {
         $('div.bannerPanel').fadeOut('slow', function() {
            $(this).remove();
         });
      }, 4000);
   }
}