local Database     = require 'database'
local PasswordHash = require 'users.passwordHash'

local function SessionTimeOut()
   return os.getenv('Session_Timeout') or 3600;
end

local function CreateSession(UserId, DB)
   -- Okay now we need to create a session and insert it into the session table
   local SessionId = util.guid(128)
   local ExpiryTime = os.ts.time() + SessionTimeOut() -- in seconds
   trace(ExpiryTime)
   SQL = [[INSERT INTO "Sessions"("SessionId", "UserId", "Expiry") VALUES(]]
        ..DB:quote(SessionId)..", "..DB:quote(UserId)..", "..ExpiryTime..")"
   
   trace(SQL)
   DB:execute{sql=SQL}
   
   return SessionId   
end

local function Login(R, S)
   if (not R.params.Email) then
      return {success=false, message="Please enter your email."}
   end
   if (not R.params.Password) then
      return {success=false, message="Please enter your password."}
   end
   
   local DB = Database()
   
   local WebInfo = iguana.webInfo()
   local Url = 'http';
   if WebInfo.web_config.use_https then
      Url = Url .. "s"
   end
   Url = Url .. "://"..WebInfo.host..":"..WebInfo.web_config.port.."/status.html"

   iguana.logInfo("Checking: "..Url)
   local _, Success = net.http.post{url=Url, live=true, auth={username= R.params.Email, password=R.params.Password}}
   iguana.logInfo("Result was "..Success)
   if Success ~= 200 then
      return {success=false, message="Invalid login"}
   end
   local SessionId = CreateSession(R.params.Email, DB)
   --local R = DB:query{sql="SELECT * FROM sessions"}
   -- TODO - we need to write code which can clear out old expired sessions
   -- TODO - write code to check for an existing session for a user???
   DB:close()
   local Result = {success=true, data={SessionId = SessionId, Name=R.params.Email,
         refreshTime=(SessionTimeOut() - 300)*1000}} -- trigger refresh 5 minutes before the session times out
   return Result
end

return Login