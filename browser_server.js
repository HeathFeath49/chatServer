var http = require("http"); 
var clientList = [];
var routes = [];
var data ={
	username: null,
	message: null
};



function broadcast(author,message){
	//console.log(clientList.length);
	clientList.forEach(function(res){
		
		//console.log(message);
		res.write(message);
		res.end();
		clientList.splice(res,1);
	});		
}

function getDataFromUrl(url){
	var d = {
		user: null,
		message: null
	}
	var u = req.url.slice(7,req.url.length);

}

function getMessage(req,res){
	addClient(res);
	var queryString = req.url;
	
	/*var username = queryString.slice(7,queryString.indexOf('&'));
	var msgStart = 7 + username.length+5;
	var message = req.url.slice(msgStart,req.url.length);
	console.log(username + " : " + message);*/
}


function welcomeUser(req,res){
	var username = req.url.slice(7,req.url.length);
	data.username = username;
	addClient(res);
	broadcast(data.username,"<h1>Welcome to chat <code>" + username + "</code></h1>");
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
		}	
	} 
}

addRoute('GET',/^\/$/,addClient);
addRoute('GET',/^\/\?user=\w+$/,welcomeUser);//need to create handler function
addRoute('GET',/^\/\?user=\w+&msg=[a-zA-Z0-9. _^%&$#?!~@,-]+$/,getMessage);


var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});
	//console.log(request.url);	
	
	//RESOLVE ROUTE	
	resolve(request,response);

	//DELETE CLIENT FROM CLIENTLIST
 	request.on("close",function(){
		//broadcast({name:response.name},"has left the chatroom");
		clientList.splice(clientList.indexOf(response),1);
	});
	 
}); 





server.listen(8000);