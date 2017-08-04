if (!table){
   var table = {}  
}

table.util = {}

// TODO URI unescaping etc.  
// This takes Blah=213423&fdgdgf=sdfsadf
// and returns an object with the keys and values in 
// the string.
table.util.parseQuery = function(Value){
   //console.log('table.util.parseQuery', Value);
   var Table = {}
   if (!Value){
     return Table;  
   }
   var Parts=Value.split('&');
   
   for(var i=0; i < Parts.length; i++){
      var Pair = Parts[i].split("=");
      Table[Pair[0]] = Pair[1]
   }
   return Table;
}

table.util.notEmpty = function(Filter){
   for (var Name in Filter){
      return true;  
   }
   return false;
}

/* Iff two hashes contain the same key/value pairs then
   return TRUE.
*/
table.util.hashCompare = function(Hash1, Hash2) {
   var hash1Parsed = Hash1.split('?');
   var hash2Parsed = Hash2.split('?');
   if (!hash2Parsed[0].includes(hash1Parsed[0])) {
      return false;
   }
   hash1Parsed = table.util.parseQuery(hash1Parsed[1]);
   hash2Parsed = table.util.parseQuery(hash2Parsed[1]);
   if (hash1Parsed.length != hash2Parsed.length) {
      return false;
   }
   for (var key in hash1Parsed) {
      if (hash2Parsed[key] !== hash1Parsed[key]) {
         return false;
      }
   }
   return true;
}