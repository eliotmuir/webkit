if (!node) {
  var node ={}
}

node.expand = function(App, Event){
   console.log("node.expand");
   console.log(Event);
   var Templates = App.templateTable();
   var Grammar = App.grammar();
   console.log('node.expand');   
   var TypeName = $(Event.currentTarget).attr("typename");
   var MemberName = $(Event.currentTarget).attr("membername");
   var NodeType = $(Event.currentTarget).attr("nodetype");
   var Target = $(Event.currentTarget).attr("target");
   
   console.log("typeName= ", TypeName, "memberName=", MemberName, "NodeType=", NodeType, "Target=", Target);
   var NodeList = Grammar.Types;
   NodeList = grammar.filter(NodeList, {"Name" : TypeName});
   console.log(NodeList);
   NodeList = grammar.filter(NodeList, {"NodeType" : NodeType});
   console.log(NodeList);
   if (NodeList.length === 0){
      // TODO put a nice error message out here
      return;  
   }
   var Node = NodeList[0];
   var Members = Node.Members;
   
   var Model = { Members : [] };
   Model.Members = node.modelMembers(Members);
   console.log(Model);
   var TargetDiv = 'div.' + Target + '-expand';
   var Template = $(Templates).filter("#ing-node-members").html();   
   $(Event.currentTarget).parent().next(".detailDiv").html(Mustache.render(Templates["/node/show/members.html"],Model)).show(800);
   var CurrentPosition = $(Event.currentTarget).position().top;
   var CurrentScrollTop = $('#content-target').scrollTop();
   var NewTop = CurrentScrollTop + CurrentPosition - 50;
   $('#content-target').animate({ scrollTop : NewTop }, 800);
	
   $(Event.currentTarget).html("[-]").removeClass('expandSubType').addClass('collapseSubType');  
   
   $(".expandSubType").unbind('click').click(function(Event){
       node.expand(App, Event);   
   });
   $(".collapseSubType").unbind('click').click(function(Event){
       node.collapse(App, Event);
   });
   
}

node.collapse = function(App, Event){
   var Templates = App.templateTable();
   var Grammar = App.grammar();
   var TypeName = $(Event.currentTarget).attr("type");
   var MemberName = $(Event.currentTarget).attr("name");
   var TargetName = $(Event.currentTarget).attr("target");
   var TargetDiv = 'div.' + TargetName + '-expand';
   console.log('node.collapse', TargetDiv);
   $(Event.currentTarget).parent().next(".detailDiv").hide(800);
   $(Event.currentTarget).html("[+]").removeClass('collapseSubType').addClass('expandSubType');
   $(".expandSubType").unbind('click').click(function(Event){
       node.expand(App, Event);   
   });
   $(".collapseSubType").unbind('click').click(function(Event){
       node.collapse(App, Event);
   });
}