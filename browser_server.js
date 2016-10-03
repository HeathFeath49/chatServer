var http = require("http"); 
var clientList = [];
var routes = [];
/*var clientCon;*/



function broadcast(author,message){
	//console.log('hit broadcast');

	clientList.forEach(function(fella){
		console.log('inside clientLoop');
		//fella.write("<p><code>"+author + "</code>:<code>" + message+"</code></p>");
		/*fella.write("<p><code>"+message+"</code></p>");*/
		console.log(author + " : "+ message);

	});		
}


function determineMsg(req,res){
	if(req.url == '/?'){
		console.log('handler satisfied!');
		broadcast(res.name,'has entered the chatroom');
	}
	else{
		console.log("ERROR AT: determineMsg");
	}
}

function addClient(req,res){
	var clientCon = res.connection;
	res.name = clientCon.remoteAddress + ":" + clientCon.remotePort;

	clientList.push(res);
	console.log('added client');
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
		if(routes[r].method == reqMethod && routes[r].url == reqUrl){
			//console.log('called handler');
			routes[r].handler(req,res);
			break;
		}
		else{
			console.log('ERROR AT: resolve');
			/*console.log(reqMethod + " " + reqUrl);*/
		}
	} 
}


addRoute('GET','/',determineMsg);
addRoute('GET','/msg:',broadcast);
addRoute('GET','/:',addClient);

var server = http.createServer(function(request, response) {
	//RESOLVE ROUTE	
	resolve(request,response);
	
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});
	response.write("<h1>Welcome to chat <code>" + response.name + "</code></h1>");

	//ANNOUNCE CLIENT LEAVING

 	//client.on("close",function(){
	// 	broadcast({name:response.name},"has left the chatroom");
	// 	clientList.splice(clientList.indexOf(response),1);
	// });
	 
}); 





server.listen(8000);
