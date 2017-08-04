local Database = require 'database'
local Refresh = require "util.refreshSession"
local InvalidSession = require 'util.invalidSession'


local function RefreshSession(R,A)
   iguana.logInfo('CHECKING SESSION');
   local Valid, User, UserId, RefreshTime = Refresh(R)
   if (not Valid) then
      return InvalidSession();
   else
      return {success=true, data={Name=User, refreshTime=RefreshTime}}
   end   
end

return RefreshSession