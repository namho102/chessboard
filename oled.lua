sda = 1 -- SDA Pin
scl = 2 -- SCL Pin
str0 = "hello world"

ssid = "viettel huongngoclan"
ssid_password = "123456789"

port = 1883
host = "broker.hivemq.com"

wifi.setmode(wifi.STATION)
wifi.sta.config(ssid,ssid_password)
wifi.sta.connect()
tmr.delay(1000000)   -- wait 1,000,000 us = 1 second
print(wifi.sta.status())
print(wifi.sta.getip())

m = mqtt.Client("ESP8266_"..node.chipid(), 120, "", "")
m:lwt("notification", "false", 1, 1)

m:connect(host, port, 0, function(conn)
  print("connected")
  m:subscribe("notification",0, function(conn) print("Subcripcion ok")
  end)
end)


m:on("offline", function(con) 
  print ("reconecting") 
  tmr.alarm(1, 10000, 0, function()
    m:connect(host, port, 0)
  end)
end)

m:on("message", function(conn, topic, data) 
  print(topic .. ": " ..data ) 
  if data ~= nil then
    str0 = data
--    write_OLED(data)
  end
end)
         
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

     disp:drawStr(5, 10, str0)
   
   until disp:nextPage() == false
   
end

  
init_OLED(sda, scl)

tmr.alarm(0, 1000, 1, function()
    print(str0)
    write_OLED()

end)


