if (!node) {
  var node ={}
}

function TYPrenameTypeMembers(Members, OldName, NewName){
   for (var j = 0; j < Members.length; j++){
      if (Members[j].MemberType.Name === OldName){
         Members[j].MemberType.Name = NewName;
      }
   }
}

function TYPrenameType(Types, OldName, NewName){
   for (var i=0; i < Types.length; i++){
      TYPrenameTypeMembers(Types[i].Members, OldName, NewName);
      // rename the response in the grammar:
      if (Types[i].NodeType === "Response" && Types[i].Name === OldName) {
         Types[i].Name = NewName;
      }
   }
}

node.sanitizeName = function(Name){
   if (typeof(Name) === 'undefined'){
      return '';   
   }
   //console.log(Name);
   //console.log(typeof(Name));
   Name = Name.replace(/[^A-Za-z0-9]/g, "");
   return Name;  
}

node.save= function(App, Event){
   var Grammar = App.grammar();
   var Name = $(Event.currentTarget).attr("name");
   var NodeType = $(Event.currentTarget).attr("nodetype");
   var OldCategory = $(Event.currentTarget).attr("category");
   var Category = $("input#Category").val() || OldCategory;
   console.log("node.save", Name, NodeType);
   var NewNode = FUNextractData();
   if (NewNode.Name !== Name){
      console.log("Changed name!  Check for dups!");
      if (-1 !== grammar.find(Grammar.Types, NewNode.Name, NodeType, OldCategory)){
         banner.dialog(App, "Sorry a node with this name and type exists already.");
         return;
      }
   }
   var NodeIndex = grammar.find(Grammar.Types, Name, NodeType, OldCategory);
   if (-1 === NodeIndex){
      App.drawMain("The node no longer exists.");
      return
   }
   console.log(NodeType);
   if (grammar.nodeTypes()[NodeType].UseCategories){
      if (Category.length === 0){
         banner.dialog(App, 'You must give a category.');
         return;
      }
      console.log("Category", Category);
      Grammar.Types[NodeIndex].Category = Category;
   }
   
   Grammar.Types[NodeIndex].Name = NewNode.Name;
   Grammar.Types[NodeIndex].Doc  = NewNode.Doc;
   Grammar.Types[NodeIndex].Members  = NewNode.Members;
   
   if (NewNode.Name !== Name){
      console.log("Renaming types.");
      TYPrenameType(Grammar.Types, Name, NewNode.Name);
      var Target = App.menuController().path().pop(); // These may be included as a function?
      Target.parent().removeChild(Target.name());     // 
   }
   
   var Category = Grammar.Types[NodeIndex].Category || '';
   // TODO an identity helper for nodes would be good
   App.save();
   if ($(Event.currentTarget).attr("link")) {
      App.router().navigate($(Event.currentTarget).attr("link"), true);
   } else {
      App.router().navigate("#node?ApiId="+ App.apiId() +"&Name=" + NewNode.Name + "&NodeType="+NodeType +"&Category=" + Category, true);
   }
   return;

   function FUNextractData(){
      var NodeData = {};
      NodeData.Name = node.sanitizeName($("input#Name").val());
      NodeData.Doc  = $("#Doc").val();
      NodeData.Members = [];
      var UniqueMap = {}
      $('div.row').each(function() {
         console.log($(this));
         var MemberInfo = {};
         MemberInfo.Name = node.sanitizeName($(this).find(".MemberName").val());
         MemberInfo.MemberType = {}
         MemberInfo.MemberType.Name     = $(this).find(".Type").val();
         MemberInfo.MemberType.NodeType = $(this).find('.Type').find('option').filter(":selected").attr('nodetype')
         MemberInfo.IsArray = $(this).find(".IsArray").is(':checked');
         console.log(MemberInfo.IsArray);
         MemberInfo.Rating = $(this).find(".Rating").val();
         MemberInfo.Doc = $(this).find(".MemberDoc").val();
         
         if (MemberInfo.Name.length > 0 && !UniqueMap[MemberInfo.Name]){
            NodeData.Members.push(MemberInfo);
            UniqueMap[MemberInfo.Name] = true;  // we don't want members with the same name to be added.
         }
      });
      return NodeData;
   }
}