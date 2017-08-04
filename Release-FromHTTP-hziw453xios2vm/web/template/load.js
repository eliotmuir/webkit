if (!template){
   var template = {};      
}
   
template.load=function(Complete){
   console.log("loadTemplates");
   $.get('loadTemplates',function(Response) { Complete(Response);  });
}