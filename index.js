var server = require("./server"); //Pour lancer le serveur
var router = require("./router"); //Pour le routage
var requestHandlers = require("./requestHandlers"); //Pour le routage
var handle = {}; 

handle["/"] = requestHandlers.start; 
handle["/start"] = requestHandlers.start; 
handle["/upload"] = requestHandlers.upload; 
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);