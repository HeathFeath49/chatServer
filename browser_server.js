var http = require("http"); 
var clientList = [];
var routes = [];



function broadcast(dataObj){
	console.log('hit broadcast');
	clientList.forEach(function(res){
		res.write(JSON.stringify(dataObj));
		res.end();
	});
	clientList = [];		
}


function sendMessage(req,res,dataObj){
	var queryString = req.url;
	var username = queryString.slice(7,queryString.indexOf('&'));
	var msgStart = 7 + username.length+5;
	var parsedQueryStr = queryString.replace(/%20/g," ");
	parsedQueryStr = parsedQueryStr.replace(/%27/g,"'");
	var message = parsedQueryStr.slice(msgStart,req.url.length);

	dataObj.user = username;
	dataObj.msg = message;
	dataObj.eve = "m";

	broadcast(dataObj);
	res.end();
}


function welcomeUser(req,res,dataObj){
	dataObj.user = req.url.slice(7,req.url.length);
	dataObj.msg = "Welcome"
	dataObj.eve = "w";
	res.write(JSON.stringify(dataObj));
	res.end();
}

function addClient(req,res){
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
	
	var reqMethod = req.method;
	var reqUrl = req.url;

	//loop through routes array and check for resolution 
	for(var r=0;r<routes.length;r++){
		if(routes[r].method == reqMethod && routes[r].url.test(reqUrl)){
			var data = {
				user: '',
				msg:'',
				eve:''
			}
			routes[r].handler(req,res,data);
		}	
	} 
}

addRoute('GET',/^\/$/,addClient);
addRoute('GET',/^\/\?user=\w+$/,welcomeUser);
addRoute('GET',/^\/\?user=\w+&msg=[a-zA-Z0-9. _^%&$#?!~@,-]+$/,sendMessage);


var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"});
	//RESOLVE ROUTE	
	resolve(request,response);	 
}); 

server.listen(8000);
