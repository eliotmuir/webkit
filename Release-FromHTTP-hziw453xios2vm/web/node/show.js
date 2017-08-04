if (!node) {
  var node ={}
}

node.show=function(App, IdentityTable){
   console.log("node.show", IdentityTable);
   var Grammar = App.grammar();
   var TemplateTable = App.templateTable();
   var CurrentNode = App.currentNode();
   var Model = {ApiId : App.apiId()}; // CategoryName : CategoryName || null}   
   var ShortList = grammar.filter(Grammar.Types, IdentityTable);
   if (ShortList.length === 0){
      App.drawMain("Node does not exist.");
      return;
   }
   
   CurrentNode = ShortList[0];
   
   if (CurrentNode.Category){
      Model.Category = CurrentNode.Category;  
   }
	
   Model.NodeName = CurrentNode.Name;
   Model.NodeType = CurrentNode.NodeType;
   Model.Doc = CurrentNode.Doc
   Model.Members = node.modelMembers(CurrentNode.Members);
   Model.MessageMenu = [];
   
   if (CurrentNode.HasResponse) {
      Model.HasResponse = true;
      var Response = Grammar.Types[grammar.find(Grammar.Types, CurrentNode.Name, "Response", CurrentNode.Category)];
      var ResponseModel = {}
      if (typeof(Response) !== "undefined") {
         ResponseModel.ApiId = App.apiId();
         ResponseModel.Members = node.modelMembers(Response.Members);
         Model.ResponseHtml = Mustache.render(TemplateTable["/node/show/members.html"], ResponseModel);
         Model.ResponseDoc = Response.Doc;
      }
   }
   var Depends = grammar.depends(Grammar.Types, CurrentNode);
   
   Model.Dependencies = [];
   for (var i=0; i< Depends.length; i++){
      Model.Dependencies.push({Name : Depends[i].Name, Category : Depends[i].Category, NodeType : Depends[i].NodeType});
   }
   Model.HasDepends = Depends.length > 0;
   App.drawMain(Mustache.render(TemplateTable["/node/show/header.html"], Model)+Mustache.render(TemplateTable["/node/show/members.html"],Model) + Mustache.render(TemplateTable["/node/show/footer.html"], Model));   
   
   $(".expandSubType").click(function(Event){
       node.expand(App, Event);   
   });
   $(".collapseSubType").click(function(Event){
       node.collapse(App, Event);
   });
   
   $("span.showDependencies").click(function(){ 
      $(this).toggleClass("open"); 
      $('div.dependencies').toggle(800);
      var CurrentPosition = $('span.showDependencies').position().top;
      var CurrentScrollTop = $('#content-target').scrollTop();
      var NewTop = CurrentScrollTop + CurrentPosition - 50;
      
      $('#content-target').animate({ scrollTop : NewTop }, 1000);
   });
   //App.setCurrentNode(CurrentNode);
   App.setCurrentState(App.currentCategory(), CurrentNode);
}

         