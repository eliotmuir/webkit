local Database = require 'database'

local SQL=[[
CREATE TABLE IF NOT EXISTS Sessions(
   SessionId text PRIMARY KEY, 
   UserId    text,
   Expiry    integer
);
]]


local function CreateDatabase()
   local DB = Database()
   DB:execute{sql=SQL}
end

return CreateDatabase