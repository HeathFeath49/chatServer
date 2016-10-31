var http = require("http"); 
var clientList = [];
var routes = [];
/*var data ={
	username: null,
	message: null
};
*/


function broadcast(dataObj){
	//console.log(clientList.length);
	clientList.forEach(function(res){
		
		//console.log(message);
		//res.write(message);
		res.write("<p>"+dataObj.user+" : " +dataObj.msg+"</p>");
		res.end();
		clientList.splice(res,1);
	});		
}


function sendMessage(req,res,dataObj){
	addClient(res);

	var queryString = req.url;
	var username = queryString.slice(7,queryString.indexOf('&'));
	var msgStart = 7 + username.length+5;
	var parsedQueryStr = queryString.replace(/%20/g," ");
	var message = parsedQueryStr.slice(msgStart,req.url.length);

	dataObj.user = username;
	dataObj.msg = message;
	console.log(username + " : " + message);
	//res.write(JSON.stringify(dataObj));
	broadcast(dataObj);
}


function welcomeUser(req,res,dataObj){
	dataObj.user = req.url.slice(7,req.url.length);
	addClient(res);
	//broadcast(dataObj.user,"<h1>Welcome to chat <code>" + dataObj.user + "</code></h1>");
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
			var data = {
				user: '',
				msg:''
			}
			routes[r].handler(req,res,data);
		}	
	} 
}

addRoute('GET',/^\/$/,addClient);
addRoute('GET',/^\/\?user=\w+$/,welcomeUser);//need to create handler function
addRoute('GET',/^\/\?user=\w+&msg=[a-zA-Z0-9. _^%&$#?!~@,-]+$/,sendMessage);


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