if (!node) {
  var node ={}
}

node.modelMembers = function(Members){
   var MembersInfo = [];
   var Primitives = grammar.primitives();
   
   for (var i=0; i< Members.length; i++){
      var MemberInfo = Members[i];
      var Info = { IsComplex : !Primitives[MemberInfo.MemberType.Name],
                  Doc : MemberInfo.Doc || '',
                  IsArray : MemberInfo.IsArray || false,
                  Rating : MemberInfo.Rating || '',
                  TypeName : MemberInfo.MemberType.Name,
                  NodeType : MemberInfo.MemberType.NodeType,
                  Target : MemberInfo.Name,
                  MemberName : MemberInfo.Name};                
      if (Info.IsArray) { Info.MemberName +="[ ]"; }
      MembersInfo.push(Info);          
   }
   return MembersInfo;
}