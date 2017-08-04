if (!node) {
  var node ={}
}

function TYPmakeMemberModelRow(Model, MemberInfo, AllowedTypeList, Attributes,Primitives){
   var Info = {MemberName : MemberInfo.Name,
               Types : [],
               IsArray : MemberInfo.IsArray || false,  
               Ratings : [],
               Doc : MemberInfo.Doc || ''};
   Info.Doc = Info.Doc.replace(/\"/g, "&quot;");
   // TODO - check if type is allowed to contain primitives.
   for (var Prim in Primitives){
      Info.Types.push({    "Name" : Prim, 
                       "NodeType" : "Primitive", 
                       "Selected" : Prim === MemberInfo.MemberType.Name});
   }
   for (var t=0; t < AllowedTypeList.length; t++){
      Info.Types.push({    "Name" : AllowedTypeList[t].Name, 
                       "NodeType" : AllowedTypeList[t].NodeType,
                       "Selected" : grammar.equal(AllowedTypeList[t], MemberInfo.MemberType) });  
   }

   if (!MemberInfo.Rating) {
      MemberInfo.Rating = 'none';   
   }
   for (var j=0; j < Attributes.length; j++){
      Info.Ratings.push({ "Rating" : Attributes[j], "Selected" : Attributes[j] == MemberInfo.Rating || false });   
   }
   Model.Members.push(Info);
}

function TYPpopulateMemberEditModel(Grammar, Node, Members, Model){
   var Attributes = grammar.attributes();
   console.log(Attributes);
   var Primitives = grammar.primitives();
   var AllowedTypeList = grammar.allowedMembers(Grammar.Types, Node);
   for (var i=0; i < Members.length; i++){
      var MemberInfo = Members[i];
      TYPmakeMemberModelRow(Model, MemberInfo, AllowedTypeList, Attributes, Primitives);
   }
}   

node.edit = function(App, Filter){
   var Grammar = App.grammar();
   var TemplateTable = App.templateTable();
   console.log("Node.edit"); 
   console.log(Filter);
   var NodeList = grammar.filter(Grammar.Types, Filter);
   if (NodeList.length === 0){
      App.drawMain("Unable to find node definition.");
      return;
   }
   var Node = NodeList[0];
   
   var Model = { Name     : Node.Name, 
                 NodeType : Node.NodeType,
                 ApiId    : App.apiId(),
                 Members : [], 
                 Doc : Node.Doc || ''};
   console.log(Model);
   if (grammar.nodeTypes()[Node.NodeType].UseCategories){
      console.log("Uses categories so show it!");
      Model.Category = Node.Category;
   }
   console.log(Model);
   
   Model.IsGeneral = Node.NodeType === "General";
   Model.HasResponse = Node.HasResponse;
   Model.IsResponse = Node.NodeType === "Response";
   
   var Members = Node.Members;
   TYPpopulateMemberEditModel(Grammar, Node, Members, Model);
   console.log(Model);
   var Html = Mustache.render(TemplateTable["/node/edit/header.html"], Model) + Mustache.render(TemplateTable["/node/edit/members.html"], Model) + Mustache.render(TemplateTable["/node/edit/footer.html"], Model);
   App.drawMain(Html);  
   $(".addMember").click   (function(Event){ node.addMember   (App, Event); });
   $(".deleteMember").click(function(Event){ node.deleteMember(App, Event); });
   $(".saveNode")    .click(function(Event){ node.save        (App, Event); });
   $(".addResponse").click(function(Event) { 
      node.addResponse (App, Node, Filter);
      node.save(App, Event); // need to save changes so when we come back they are still there
   });
   $(".editResponse").click(function(Event){ 
      node.save(App, Event);
      node.editResponse(App, Event);
   });
   
   $("#sortable").sortable();
   $("#sortable").disableSelection();
   //App.setCurrentNode(Node);
   App.setCurrentState(App.currentCategory(), Node)
}

node.addMember=function(App, Event){
   var Grammar = App.grammar();
   var Name = $(Event.currentTarget).attr("name");
   var NodeType = $(Event.currentTarget).attr("nodetype");
   var Category = $(Event.currentTarget).attr("category");
   console.log("addMember", Name, NodeType);
   var Filter = {"Name" : Name, "NodeType" : NodeType, Category : Category}
   
   var NodeList = grammar.filter(Grammar.Types, Filter);
   if (NodeList.length === 0){
      App.drawMain("Unable to find node definition.");
      return;
   }
   var Node = NodeList[0];
   console.log(Node);
   var Model = {}
   Model.Members =[];
   var Members = [];
   
   Members.push({ Name : "", MemberType : {Name : "String", NodeType : "Primitive"} });
   TYPpopulateMemberEditModel(Grammar, Node, Members, Model);
   console.log(Model);
   var Template = App.templateTable()["/node/edit/members.html"];    
   var Html = Mustache.render(Template, Model);
   //console.log(Html);
   $('div.memberTable').append(Html);  
}

node.deleteMember=function(App, Event){
   console.log("node.deleteMember");
   var GV = $(Event.currentTarget).parents("div.row");
   $(GV).hide(1100, function() {$(GV).remove();});
}

