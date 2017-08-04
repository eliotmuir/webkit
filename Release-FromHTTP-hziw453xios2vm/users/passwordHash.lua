
-- In theory we could store the algorithm used to create the hash to
-- allow the algorithm to be improved over time.
local function PasswordHash(Salt, Password, Algorithm) 
   local PasswordHash = crypto.digest{data=Salt.. ":" ..Password,algorithm=Algorithm}
   return filter.hex.enc(PasswordHash)
end

return PasswordHash