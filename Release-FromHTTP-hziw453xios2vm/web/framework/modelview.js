if (!framework){
   var framework = {}  
}

framework.model = function(Name){
   var m_Name = Name;
   var m_Views = [];
   
   this.update = function(){
      for (var i=m_Views.length-1; i >=0; i--){
         console.log("Updating view " + m_Views[i].name());
         m_Views[i].update();
      }
   }
   
   this.addView = function(View){
      console.log("Added view " + View.name());
      m_Views.push(View); 
   }
   
   this.clear = function(){
      m_Views.length = 0;
   }
   
   this.name = function(){
      return m_Name;
   }
};

framework.view = function(Name, UpdateCall){
   var m_Name = Name;
   var m_UpdateCall = UpdateCall;
   
   this.update = function(){
      m_UpdateCall();  
   }
   
   this.name = function(){
      return m_Name;
   }   
};