-- Variables 
time=nil
sda = 1 -- SDA Pin
scl = 2 -- SCL Pin
timezone = "EST"  
str1="    Hello World!!"
str2="     @namtoan"

ssid="viettel huongngoclan"
ssid_password="123456789"
s=0
m=0
h=0

function gettime() -- Get Time by connecting to timeapi.org
   time=nil
   conn=net.createConnection(net.TCP, 0) 
   conn:on("connection",function(conn, payload)
   conn:send("GET /"..timezone.."/now "..
       "HTTP/1.1\r\n".. 
       "Host: www.timeapi.org\r\n"..
       "Accept: */*\r\n"..
       "User-Agent: Mozilla/4.0 (compatible; esp8266 Lua;)"..
       "\r\n\r\n") 
   end)
            
   conn:on("receive", function(conn, payload)
       for line in string.gmatch(payload.."\n", "([^\n]*)\n") do -- Just get last line of html
          datetime = line
       end;
       --print('DateTime: '..datetime)
       time = string.sub(datetime,string.find(datetime,"T")+1,string.find(datetime,"T")+8)
       conn:close()
   end) 

   conn:connect(80,'www.timeapi.org')
   return(time)
end

function wait_for_time()
  if time == nil then 
     print("Waiting for time...")
  else
    tmr.stop(2)
    print("Time Set! "..time)
    h = tonumber(string.sub(time,1,2))
    m = tonumber(string.sub(time,4,5))
    s = tonumber(string.sub(time,7,8))
  end
end
         
function init_OLED(sda,scl) --Set up the u8glib lib
     sla = 0x3C
     i2c.setup(0, sda, scl, i2c.SLOW)
     disp = u8g.ssd1306_128x64_i2c(sla)
     disp:setFont(u8g.font_6x10)
     disp:setFontRefHeightExtendedText()
     disp:setDefaultForegroundColor()
     disp:setFontPosTop()
     --disp:setRot180()           -- Rotate Display if needed
end

function write_OLED() -- Write Display
   disp:firstPage()
   repeat
     --disp:drawFrame(2,2,126,62)
     disp:drawStr(5, 10, str1)
     disp:drawStr(35, 30,  string.format("%02d:%02d:%02d",hd,m,s)..meridies)
     disp:drawStr(5, 50, str2)
     --disp:drawCircle(18, 47, 14)
   until disp:nextPage() == false
   
end



-- Main Program 

wifi.setmode(wifi.STATION)
wifi.sta.config(ssid,ssid_password)
wifi.sta.connect()
tmr.delay(1000000)   -- wait 1,000,000 us = 1 second
print(wifi.sta.status())
print(wifi.sta.getip())
  
init_OLED(sda,scl)

time=gettime() -- Set clock to time server
tmr.alarm(2, 1000, 1, wait_for_time)

tmr.alarm(0, 1000, 1, function() -- Every second increment clock and display
   s = s+1
   if s==60 then
     s=0
     m=m + 1
   end
   if m==60 then
     m=0
     h=h + 1
     time=gettime() -- sync time every hour
     tmr.alarm(2, 1000, 1, wait_for_time)
   end
   if h==24 then
     h=12
   end
   hd = h
   meridies="AM"
   if hd > 12 then
     hd = hd - 12
     meridies="PM"
   end
   
   --print(string.format("%02d:%02d:%02d",h,m,s))
   write_OLED()
end)