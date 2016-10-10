var http = require("http"); 
var clientList = [];
var routes = [];




function broadcast(author,message){
	//console.log('hit broadcast');

	clientList.forEach(function(fella){
		console.log('inside clientLoop');
		//fella.write("<p><code>"+author + "</code>:<code>" + message+"</code></p>");
		/*fella.write("<p><code>"+message+"</code></p>");*/
		console.log(author + " : "+ message);

	});		
}


function welcomeUser(req,res){
	var username = req.url.slice(7,req.url.length);
	console.log(username);
	addClient(res);
	res.write("<h1>Welcome to chat <code>" + username + "</code></h1>");
	
	
}

function addClient(res){
	var clientCon = res.connection;
	res.name = clientCon.remoteAddress + ":" + clientCon.remotePort;

	clientList.push(res);
	
}

function addRoute(method,url,handler){
	routes.push({
		method:method,
		url:url,
		handler:handler
	});
}


function resolve(req,res){ 
	//console.log('hit resolve');
	var reqMethod = req.method;
	var reqUrl = req.url;

	//loop through routes array and check for resolution 
	for(var r=0;r<routes.length;r++){
		if(routes[r].method == reqMethod && routes[r].url.test(reqUrl)){
			routes[r].handler(req,res);
			break;
		}	
	} 
}

//addRoute('GET',/^\/$/,addClient);
addRoute('GET',/\/\?user=\w+/,welcomeUser);//need to create handler function
//addRoute('GET',/^\/?user=/,broadcast);


var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});
	//response.write("<h1>Welcome to chat <code>" + response.name + "</code></h1>");
	
	//RESOLVE ROUTE	
	resolve(request,response);
	response.end();


	//ANNOUNCE CLIENT LEAVING
 	/*client.on("close",function(){
		broadcast({name:response.name},"has left the chatroom");
		clientList.splice(clientList.indexOf(response),1);
	});*/
	 
}); 





server.listen(8000);