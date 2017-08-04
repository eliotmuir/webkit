local Database = require 'database'

local function CheckSession(R)
   local Session = R.cookies.session
   if (not Session) then
      return false
   end
   local DB = Database()
   local R = DB:query{sql=[[SELECT * FROM Sessions]]..
      [[ WHERE SessionId = ]]..DB:quote(Session)}
   DB:close()
   trace(R)
   
   if (#R ~= 1) then
      return false
   end
   if (not iguana.isTest() and tonumber(R[1].expiry:S()) < os.ts.time()) then
      return false   
   end
   local Expiry = (R[1].Expiry:nodeValue() - os.ts.time() - 10) *1000
   return true ,R[1].UserId:S(),Expiry
end

return CheckSession
      