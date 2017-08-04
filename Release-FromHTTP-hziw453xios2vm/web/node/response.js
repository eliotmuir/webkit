if (!node) {
  var node ={}
}

node.addResponse = function(App, Node, Filter) {
   var Grammar = App.grammar().Types;
   console.log('Adding Response');
   var Response = {Category : Filter.Category,
                   Name : Filter.Name,
                   NodeType : "Response",
                   Doc : "",
                   Members : []
                  }
   Grammar.push(Response);
   Node.HasResponse = true;
   App.save();
}

node.editResponse = function() {
   
}