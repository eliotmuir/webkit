
local Template=[[
<html>
<head>
   <title>Deployment Tool</title>
]]

local Footer=[[
		<style>         
         html, body, #wrapper {
            height:100%;
            width: 100%;
            margin: 0;
            padding: 0;
            border: 0;
            background: #f2f3f4;
         }
         #wrapper td {
            vertical-align: middle;
            text-align: center;
         }
         div.initializing-container {
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 4px;
            box-shadow: 1px 2px 4px 2px #ecedef;
            padding: 40px;
            max-width: 400px;
            margin: auto;
         }
         h1 {
            color: #5bbc46;
            font-weight: 300;
            font-family: "open sans";
         }   
		</style>
</head>
<body class="in">
      <table id="wrapper">
        <tr>
          <td>
             
             <div class="initializing-container">
                <h1>&nbsp;Initializing...</h1>
                <img src="web/images/loader.gif" alt="loading..." />
             </div>
             
          </td>
        </tr>
      </table>
</body>
</html>
]]

local function CssFiles(FileList)
   local List = {}
   for File in pairs(FileList) do
      if File:sub(-3) == "css" then
         if File:sub(1, 5) == 'other' then
            List[#List+1] = File:sub(7)
         else
            List[#List+1] = File    
         end     
      end
   end
   return List
end

local function JsFiles(FileList)
   local List = {}
   for File in pairs(FileList) do
      if File:sub(-2) == "js" then
         if File:sub(1, 5) == 'other' then
            List[File:sub(7)] = true
         else
            List[File] = true    
         end     
      end
   end
   return List
end

local JsFirst={"web/libe/jquery-1.11.2.min.js"}
   
local function CreateIndex()
   local R = Template
   local FileList = iguana.project.files()
   local Css = CssFiles(FileList)
   local Js  = JsFiles(FileList)
   for i=1, #Css do 
      R = R..'\t<link rel="stylesheet" type="text/css" href="'..Css[i]..'">\n'
   end
   for i=1, #JsFirst do
      R = R..'\t<script type="text/javascript" src="'..JsFirst[i]..'"></script>\n'
      Js[JsFirst[i]] = nil
   end
   
   for K in pairs(Js) do 
      R = R..'\t<script type="text/javascript" src="'..K..'"></script>\n'      
   end
   R = R..Footer
   trace(R)
   net.http.respond{body=R}
   return {alreadyHandled=true}   
end

return CreateIndex