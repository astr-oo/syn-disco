local PORT = 3000

local WebSocket = syn.websocket.connect("ws://localhost:"..PORT) -- Specify your WebSocket URL here.

WebSocket.OnMessage:Connect(function(Msg)
    local scc, err = pcall(loadstring(Msg))
    if scc then
        WebSocket:Send("[+] Script executed!")
    else
        WebSocket:Send("[x] " .. tostring(err))
    end
end)
hookfunction(print, function(x)
    WebSocket:Send("[i] " .. tostring(x))
end)

hookfunction(warn, function(x)
    WebSocket:Send("[w] " .. tostring(x))
end)
