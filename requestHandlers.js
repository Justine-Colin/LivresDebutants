//var exec = require("child_process").exec;
var querystring = require("querystring"), //Permet de récupérer juste le contenu des champs   
    fs = require("fs"),   //Lecture de files
    formidable = require("formidable"); //Gestion des formulaire

function start(response) {  
    console.log("Le gestionnaire 'start' est appelé.");  
    console.log('ImgPath');
    //Formulaire pour les fichiers
    var body = '<html>'+    
                    '<head>'+    
                        '<meta http-equiv="Content-Type" '+    
                        'content="text/html; charset=UTF-8" />'+    
                    '</head>'+    
                    '<body>'+    
                        '<form action="/upload" enctype="multipart/form-data" '+    
                            'method="post">'+    
                            '<input type="file" name="upload" multiple="multiple">'+    
                            '<input type="submit" value="Transférer l\'image" />'+    
                        '</form>'+    
                    '</body>'+    
                '</html>';  
    //#region com2
    /* Premier formulaire (envoi de texte)
    L'opération peut devenir bloquante si "roman" => node envoie par paquets
    var body = '<html>'+    
                    '<head>'+    
                        '<meta http-equiv="Content-Type" content="text/html; '+    
                        'charset=UTF-8" />'+    
                    '</head>'+    
                    '<body>'+    
                        '<form action="/upload" method="post">'+  //Envoie vers la page upload qand on appuie sur envoyer  
                            '<textarea name="text" rows="20" cols="60"></textarea>'+    
                            '<input type="submit" value="Envoyer" />'+    
                        '</form>'+    
                    '</body>'+    
                '</html>';   
    */ 
   //#endregion  
    response.writeHead(200, {"Content-Type": "text/html"});    
    response.write(body);    
    response.end(); 
    //#region com1
    /* On s'assure que ce soit non bloquant pour les requêtes uplaod
    exec("find /",    
    { timeout: 10000, maxBuffer: 20000*1024 },
    function (error, stdout, stderr) {      
        response.writeHead(200, {"Content-Type": "text/plain"}); 
        response.write(stdout);      
        response.end();    
    }); 
    */
   //#endregion
}

function upload(response, request) {  //On utilise request à la place de postData
    console.log("Le gestionnaire 'upload' est appelé.");  

    var form = new formidable.IncomingForm();  //Formulaire
    console.log("Récupération des éléments reçus");  
    form.parse(request, function(error, fields, files) { //Sépare les éléments du form   
        console.log("Traitement terminé");

        //En cas d'erreur sous Windows : tentative d'écrasement d'un fichier existant    
        fs.rename(files.upload.path, "./tmp/test.png", function(err) { 
            //Change le nom     
            if (err) { //Si le fichier existe     
                
                fs.unlinkSync("./tmp/test.png"); //Supprime l'ancien  
                console.log("Une erreur s'est levée, le fichier existe déjà");      
                fs.rename(files.upload.path, "./tmp/test.png", function(error){
                    console.log(error);
                }); //Remet le nouveau fichier 
            }
        });   
        response.writeHead(200, {"Content-Type": "text/html"});    
        response.write("Image recue :<br/>");    
        response.write("<img src='/show' />"); //Affiche l'image qui se trouve sur l'url show    
        response.end();
        //#region com3
        /* Première réponse (avant request)
        response.writeHead(200, {"Content-Type": "text/plain"});  
        response.write("Vous avez envoyé : " + postData); //Affichage du texte envoyé
        response.write("Vous avez envoyé : "+ querystring.parse(postData).text); //Enlève les noms des champs
        response.end(); 
        */
        //#endregion  
    }); 
} 

function show(response) {  //Lecture et affichage du fichier
    console.log("Le gestionnaire 'show' est appelé.");  
    fs.readFile("./tmp/test.png", "binary", function(error, file) {    
        if(error) {  //500 : internal servor error  
            response.writeHead(500, {"Content-Type": "text/plain"});      
            response.write(error + "\n");      
            response.end();    
        } 
        else {      
            response.writeHead(200, {"Content-Type": "image/png"});      
            response.write(file, "binary"); //Affiche le fichier      
            response.end();    
        }   
    }); 
} 

//Permet d'avoir accès aux fonctions avec require
exports.start = start; 
exports.upload = upload; 
exports.show = show;
