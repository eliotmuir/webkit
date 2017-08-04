local config = require 'encrypt.password'

local Password = config.load{config='ApiPassword', key='KJHASkj233j3d'}
local User = config.load{config='ApiUser', key='KJHASkj233j3d'}

--config.save{config='ApiPassword', password='', key='KJHASkj233j3d'}
--config.save{config='ApiUser', password='', key='KJHASkj233j3d'}

local function Database()
   trace(User, Password)
   local DB = db.connect{api=db.SQLITE, 
      name='DeploySession'}
   return DB   
end

return Database
