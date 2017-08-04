if (!main) {
   var main = {}
}

main.start = function(App){
   var Model = {}
   var Html = Mustache.render(App.templateTable()["/main/start.html"], Model);
   App.drawMain(Html);  
}
  