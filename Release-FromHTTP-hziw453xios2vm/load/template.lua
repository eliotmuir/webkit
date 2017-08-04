

local function LoadFile(File)
   local F = io.open(File, "rb")
   local C = F:read("*a")
   F:close()
   return C
end


local function HtmlFiles(FileList, TestUser)
   local List = {}
   local ProjectRoot
   if TestUser then
      ProjectRoot = iguana.workingDir()..'edit/'..TestUser.."/"..iguana.project.guid()..'/'
   else
      ProjectRoot = iguana.workingDir()..iguana.project.root()..iguana.project.guid()..'/'
   end
   
   for File in pairs(FileList) do
      if File:sub(-4) == "html" then
         if File:sub(1, 5) == 'other' then
            -- Ignore common html files.
            --List[File:sub(7)] = LoadFile(File)
         else
            List[File:sub(4)] = LoadFile(ProjectRoot..File)    
         end     
      end
   end
   return List
end

   
local function LoadTemplate(R, Server)
  local Template = {}
   local FileList = iguana.project.files()
   local Html = HtmlFiles(FileList, Server.test)
   return Html
end

return LoadTemplate