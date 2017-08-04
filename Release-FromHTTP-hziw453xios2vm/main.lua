-- **********************************************************************
--
--   Iguana Web app starter kit
--
-- **********************************************************************

require 'iguana.info'
require 'html_entities'
require 'net.http.cache'
require 'web.server'

local CreateDb       = require 'create_db'


-- globals:
auth = require 'web.basicauth'

store2 = require 'store2'  

local Login          = require 'users.login'
local CheckSession   = require 'users.checkSession'
local RefreshSession = require 'users.refreshSession'
local Logout         = require 'users.logout'
local LoadIndex      = require 'load.index'
local LoadTemplates  = require 'load.template'


-- Use for strictly RESTful APIs
-- method / action / provider:
local Routes = {
   GET    = {
      default = {
         default = blankHandler
      }
   },
   POST   = {
      default = {
         default = blankHandler
      }
   },
   PUT    = {
      default = {
         default = blankHandler
      }
   },
   DELETE   = {
      default = {
         default = blankHandler
      }
   }
}

local function blankHandler(Request)
   return {}
end

local function route(Request)
   local Method   = Request.method
   local Action   = Request.params.action or 'default'
   local Provider = Request.params.provider or 'default'
   trace(Method, Action, Provider)
   if(method == "DELETE" and provider == nil) then
      t = {}
      t.result= "DELETE / missing provider?"
      return t
   end
   return Routes[Method][Action][Provider](Request)
end


local ServerConfig = {
   default = 'web/index.html',  -- This is a dummy line - in reality LoadIndex creates the index page.
   auth    = true,
   test    = 'admin',
   actions = {
      ["grammar"] = route,
      login      = Login,
      logout     = Logout,
      checkSession = CheckSession,
      refreshSession = RefreshSession,
      loadTemplates = LoadTemplates 
      -- Add other handlers here at your discretion
   }
}

ServerConfig.actions[''] = LoadIndex

local Server = web.webserver.create(ServerConfig)

-- Create session DB if it does not exist.
CreateDb()

function main(Data)
   Server.auth = false
   Server:serveRequest{data=Data}
end
