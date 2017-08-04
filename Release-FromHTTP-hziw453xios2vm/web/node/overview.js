if (!node) {
  var node ={}
}

/* Check Legacy Grammars
   May want to move this to a util funciton. For now, this
   is mostly just validating grammars that we broke due to
   bugs in the Designer App. The function checks the exist-
   ing grammar's categories, and the categories that can
   be found in all of the grammar's Types, and determines
   if there is inconsistency (which returns true).
*/
CHKlegacyGrammars = function(App, Grammar) {
   if ((Grammar.Categories.length == 0 && App.grammar().Types.length > 0) || typeof(Grammar.Categories) === "undefined") {
      return true;
   }
   var TypeCategories = [];
   for (var i = 0; i < Grammar.Types.length; i++) {
      if (Grammar.Types[i].Category && (-1 == grammar.find(TypeCategories, Grammar.Types[i].Category))) {
	      TypeCategories.push(Grammar.Types[i].Category);
      }
   }
   if (Grammar.Categories.length !== TypeCategories.length) {
      return true;
   }
   return false;
}

FIXlegacyGrammars = function(App, Grammar) {
   var currentProject = App.project();
   var Types = Grammar.Types;
   var Categories = Grammar.Categories || [];
   for (var i = 0; i < Types.length; i++) {
      if (Types[i].Category && (-1 == grammar.find(Categories, Types[i].Category))) {
         Categories.push({Name: Types[i].Category, Doc: ""});
      }
   }
   currentProject.Data = {Types: Types, Categories: Categories};
   console.log('Fix Legacy Grammar');
   App.save();
}

node.overview = function(App){
   console.log("In the overview page.")
   var Count = { Message : 0, General : 0}  // TODO this is specific to JSON grammars - need to revize later!
   var Grammar = App.grammar();
   var Categories = Grammar.Categories || [];
   if (CHKlegacyGrammars(App, Grammar)) {
      FIXlegacyGrammars(App, Grammar);
      Categories = App.grammar().Categories;
   }
   var TemplateTable = App.templateTable();
   
   console.log(Grammar);
   
   for (var i=0; i<Grammar.Types.length; i++){
      var Node = Grammar.Types[i];
      if (Node.NodeType === "Response") {
         continue;
      }
      Count[Node.NodeType] = (Count[Node.NodeType] || 0) +1;
   }
   console.log(Count);
   var Model = {Types :[], Name : App.apiName(), Description : App.apiDescription(), ApiId : App.apiId() }
   for (var NodeType in Count){
      Model.Types.push({NodeType : NodeType, Count : Count[NodeType] })  
   }
   App.drawMain(Mustache.render(TemplateTable['/node/overview.html'], Model));  
   $("#edit").click(function(){
      App.router().navigate("#overview/edit?ApiId=" + App.apiId(), true);
   });
   
   App.setCurrentState(null, null);
}