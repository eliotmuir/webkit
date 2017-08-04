local Database = require 'database'

-- code for updating the expiry time of a session that
-- is still valid.
--
-- newExpiryTime is returned so that the client side
-- application can reset its refresh timer.
local function RefreshSession(R)
   local Session = R.cookies.session
   if (not Session) then
      return false
   end
   local DB = Database()
   local R = DB:query{sql=[[SELECT "Sessions"."Expiry", "Users"."Name", "Users"."UserId" FROM "Users", "Sessions"]]..
      [[ WHERE "Sessions"."UserId" = "Users"."UserId" AND "Sessions"."SessionId" = ]]..DB:quote(Session)}
   if (#R ~= 1) then
      DB:close()
      return false
   end
   if (not iguana.isTest() and tonumber(R[1].expiry:S()) < os.ts.time()) then
      DB:close()
      return false   
   end
   
   local newExpiryTime = os.ts.time() + os.getenv('Session_Timeout')
   DB:execute{sql=[[UPDATE "Sessions" SET "Expiry" = ]]..newExpiryTime..[[ WHERE "SessionId" = ]]..DB:quote(Session)}
   DB:close()
   
   return true , R[1].Name:S(), R[1].UserId:S(), (os.getenv('Session_Timeout') - 300)*1000
end

return RefreshSession
      