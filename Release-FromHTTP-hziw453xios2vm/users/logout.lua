local Database = require 'database'

local function Logout(R,A)
   if (not R.cookies.session) then
      return {success=true, message="Session already removed."}
   end
   local DB = Database()
   local SQL = [[DELETE FROM "Sessions" WHERE "SessionId" = ]]..DB:quote(R.cookies.session)
   trace(SQL)
   DB:execute{sql=SQL}
   DB:close()
   return {success=true, message="Logged you out."}
end


return Logout