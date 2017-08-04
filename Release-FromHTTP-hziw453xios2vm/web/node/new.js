if (!node) {
  var node ={}
}

function TYPshowCategory(NodeType, NodeGrammar, Speed){
   var UseCategories = NodeGrammar[NodeType].UseCategories;
   console.log(UseCategories);
   if (UseCategories){
      $("#categoryPanel").show(Speed);   
   }else{
      $("#categoryPanel").hide(Speed);
   }
}

node.new=function(App, Defaults){
   var Grammar = App.grammar();
   console.log('node.new');
   console.log(Defaults);
   var Category = Defaults.Category || '';
   
   var Model = {Categories : [], NodeTypes :[], Category : Category}
   var Categories = grammar.categories(Grammar);
   var Types      = grammar.nodeTypeList();
   
   for (var i=0; i < Categories.length; i++){
      Model.Categories.push({Category : Categories[i]})
   }
   for (var i=0; i < Types.length; i++){
      Model.NodeTypes.push({NodeType : Types[i], IsSelected : Types[i] === Defaults.NodeType});
   }
   
   console.log(Model);
   App.drawMain(Mustache.render(App.templateTable()["/node/new.html"], Model));
   $(".addNode").click(function(){node.addNode(App);});
   
   var NodeGrammar = grammar.nodeTypes();
   
   $('#SelectNodeType').change(function(){
      TYPshowCategory($(this).val(), NodeGrammar, 800);
   });
   TYPshowCategory($('#SelectNodeType').val(), NodeGrammar, 0);
}

node.addNode=function(App){
   var Grammar = App.grammar();
   var Name = node.sanitizeName($("input[name=nodename]").val());
   var NodeType = $(".NodeType").val();
   var Category = $("#Category").val();
   var Description = $(".Doc").val();
   
   if (Name.length === 0){
      banner.dialog(App, "Name cannot be empty.");
      return;
   }
   if (-1 !== grammar.find(Grammar.Types, Name, NodeType, Category)){
      banner.dialog(App, "A node of this type and name exists already.");    
      return;
   }
   var NewNode ={Name : Name, Doc : Description, NodeType : NodeType, Members :[]}
   var UseCategory = grammar.nodeTypes()[NodeType].UseCategories
   var NavTo = "node?ApiId=" + App.apiId() + "&Name=" + Name + "&NodeType=" + NodeType;
   if (UseCategory){
      NewNode.Category = Category;
      if (Category.length === 0){
         banner.dialog(App, "Category cannot be empty.");
         return
      }
      if (-1 === grammar.find(Grammar.Categories, Category)) {
         Grammar.Categories.push({Name: Category, Doc:""});
      }
      NavTo += "&Category=" + Category;
   }
   
   Grammar.Types.push(NewNode);
   App.router().navigate(NavTo, true);
   App.save();
   
   console.log("addNode", Name, NodeType, Category, Description);
}
