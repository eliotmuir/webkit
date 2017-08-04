if (!node) {
  var node ={}
}

node.deleteExecute = function(App, Event){
   var Grammar = App.grammar();
   var Name = $(Event.currentTarget).attr("nodename");
   var NodeType = $(Event.currentTarget).attr("nodetype");
   var Category = $(Event.currentTarget).attr("category");
  
   var Target = App.menuController().path().pop();
   Target.parent().removeChild(Target.name());
   
   var NodeIndex=-1;
   
   var UseCategories = grammar.nodeTypes()[NodeType].UseCategories;
   
   for(var i=Grammar.Types.length-1;i >=0;i--){
      var Node = Grammar.Types[i];
      if (Node.Name === Name && Node.NodeType === NodeType && (!UseCategories || (Node.Category == Category))){
         NodeIndex = i;
      } else {
         var Members = Node.Members;
         for (var j=Members.length-1; j >= 0;j--){
            if (Members[j].MemberType.Name === Name && Members[j].MemberType.NodeType == NodeType){
               Members.splice(j,1);
            }
         }  
      }
   }
   if (NodeIndex === -1){
      App.drawMain("Couldn't find node " + Name);
      return;
   }
   Grammar.Types.splice(NodeIndex, 1);
   banner.dialog(App, 'Deleted ' + Name);
   if (NodeType === "Response") {
      Grammar.Types[grammar.find(Grammar.Types, Name, "Message", Category)].HasResponse = false;
   }
   App.save();
   App.router().navigate("#overview?ApiId=" + App.apiId(), true);
}

node.delete = function(App, Args){
   console.log("Delete");
   var Grammar = App.grammar();
   var Name = Args.Name;
   var NodeType = Args.NodeType;
   var Category = Args.Category;
   
   var UseCategories = grammar.nodeTypes()[NodeType].UseCategories;
   
   var Model = { NodeName : Name, NodeType : NodeType, Category : Category, ApiId : App.apiId(), Dependencies : []};
   
   for(var i=Grammar.Types.length-1;i >=0;i--){
      var Node = Grammar.Types[i];
      var Members = Node.Members;
      for (var j=Members.length-1; j >= 0;j--){
         if (Members[j].MemberType.Name === Name && Members[j].MemberType.NodeType == NodeType){
            Model.Dependencies.push({Name : Node.Name, Category : Node.Category || '', NodeType : Node.NodeType});
         }
      }  
   }
   Model.HasDependencies = Model.Dependencies.length > 0;
   console.log(Model);
   
   var Html = Mustache.render(App.templateTable()["/node/delete.html"], Model);
   App.drawMain(Html);
   $(".deleteNode")  .click(function(Event){ node.deleteExecute(App, Event); });
   
   var Node = grammar.find(Grammar, Name, NodeType, Category);
   App.setCurrentState(App.currentCategory(), Node)
   
}
