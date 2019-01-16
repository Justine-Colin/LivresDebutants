var http = require("http"); //Biblio du serveur http
var url = require("url"); 

function start(route, handle) { //Routage avec paquets (non bloquant) 
    function onRequest(request, response) {  
        // var postData = "";   On ne l'utilisa plus
        var pathname = url.parse(request.url).pathname; //Choppe l'url  
        console.log("Requête reçue pour le chemin " + pathname + ".");    
        route(handle, pathname, response, request);  
    }  
    http.createServer(onRequest).listen(8888); //Création du serveur sur le port 8888 
    console.log("Démarrage du serveur sur le port 8888."); 
    //#region com2
        /* La gestion de post data n'est plus nécéssaire, on utilise request dans le routeur
        request.setEncoding("utf8"); //Précise que les données sont en utf8
        request.addListener("data", function(postDataChunk) { //A chaque paquet prêt
            postData += postDataChunk; //On l'add au texte  
            console.log("Paquet POST reçu '"+ postDataChunk + "'.");    
        });    
        request.addListener("end", function() { //Quand on a tous les paquets 
            route(handle, pathname, response, postData); //On affiche la page
        });   
        */
    //#endregion
    //#region com1
        /* Premier routage, pas de paquets
        var pathname = url.parse(request.url).pathname;  //Récupère l'url pour le routage
        console.log("Requête reçue pour le chemin " + pathname + ".");    
        route(handle, pathname, response);
        // Ancien affichage, route qui va gérer ça
        response.writeHead(200, {"Content-Type": "text/plain"}); //Message de retour 200 : OK + type de réponse = text
        response.write("Hello World"); //Affichage 
        response.end();  
        */
    //#endregion
} 

exports.start = start;
