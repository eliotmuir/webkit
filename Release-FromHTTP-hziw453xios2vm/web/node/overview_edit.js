if (!node) {
  var node ={}
}

node.overviewEdit = function(App){
   console.log("In the overview edit page.")
   var Grammar = App.grammar();
   var TemplateTable = App.templateTable();
   
   var Model = {Name : App.apiName(), Description : App.apiDescription(), Id : App.apiId() }
   App.drawMain(Mustache.render(TemplateTable["/node/overview_edit.html"], Model));  
   $("#save").click(function(){
      App.setApiName($("#Name").val());
      App.setApiDescription($('#Description').val());
      App.save();
      // TODO - it's error prone having plain variable assignment like Id= here.
      App.router().navigate("#overview?ApiId=" + App.apiId(), true);
   });
   $("#cancel").click(function(){
      App.router().navigate("#overview?ApiId=" + App.apiId(), true);      
   });        
   
   $("#delete").click(function(){
      console.log("Deleted api");
      $.post("deleteAPI", { ApiId : App.apiId()}, function(R){
         console.log("deleteAPI done");
         console.log(R);
         App.router().navigate("#", true);
      });
   });
}