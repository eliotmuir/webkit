local Database = require 'database'
local Check = require "util.checkSession"
local InvalidSession = require 'util.invalidSession'


local function CheckSession(R,A)
   iguana.logInfo('CHECKING SESSION');
   local Valid, User, Expiry = Check(R)
   if (not Valid) then
      return InvalidSession();
   else
      return {success=true, data={Name=User, ExpireTime=Expiry}}
   end   
end

return CheckSession