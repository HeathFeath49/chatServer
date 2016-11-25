
function sendRepeatedRequests(requested){
	var req = new XMLHttpRequest();

	req.open("GET",requested,true);
	
	req.send(null);

	req.addEventListener("load",function(){
		var data = JSON.parse(req.responseText);
		if(data.eve == "w"){
			document.getElementById("messageBoard").innerHTML += "<h1>Welcome "+data.user+"</h1>";
		}
		else if(data.eve == "m"){
			var elements = instantiateTemplate("msgTemplate",data);
			elements.removeAttribute("id");
			console.log(elements);
			document.getElementById("messageBoard").append(elements);
			//document.getElementById("messageBoard").innerHTML += "<p>"+data.user+" : " +data.msg+"</p>";	
		}
		sendRepeatedRequests("http://localhost:8000/");	
	})
}

function sendMessage(username,message){
	var req = new XMLHttpRequest();
	req.open("GET","http://localhost:8000/?user="+username+"&msg="+message);
	req.send(null);
}

function replaceText(node,data){
	var startI;
	var endI;
	var v;
	//console.log('hit replaceText');
	for (i=0;i<node.nodeValue.length;i++){
		if(node.nodeValue[i] == '{'){
			startI = i+1;
		}
		else if(node.nodeValue[i] == '}'){
			endI = i;
			v = node.nodeValue.slice(startI,endI);
			console.log(data);
      		node.nodeValue = node.nodeValue.replace("{{"+v+"}}", data[v]);
		}
	}
  return node;
}

function deepCopyAndReplace(node,dataObj){
	var cloneNode;
	var newTextNode;
	var editedNode;
	//console.log('hit deepCopyAndReplace');
	if(node.nodeType == document.ELEMENT_NODE){
		cloneNode = node.cloneNode(false);

		for(var i = 0; i < node.childNodes.length;i++){
	  		cloneNode.append(deepCopyAndReplace(node.childNodes[i],dataObj));
		}
		return cloneNode;
	}
	else if(node.nodeType == document.TEXT_NODE){
		//create new text node
		newTextNode = document.createTextNode(node.nodeValue);
		editedNode = replaceText(newTextNode,dataObj);
		return editedNode;
	}
}

function instantiateTemplate(id, data) {
  var nodeToAppendData = document.getElementById(id); // msgDisplay in http://codepen.io/anon/pen/ALaEbg 
  // your code to instantiate template goes here
  //console.log('hit instantiateTemplate');
  var newNode = deepCopyAndReplace(nodeToAppendData,data);
  //Gotta do something with new node!
  return newNode; 

}

//Event Emitter Class
function EventEmitter() {
 	this.eventListeners = {}; // eventName: handler
}

EventEmitter.prototype.on = function(eventStr, handler) {
	//check if eventStr is already in eventListeners
	if(!(this.eventListeners[eventStr])){
		this.eventListeners[eventStr] = [handler];	
	}
	else{
		//push to array of handlers
		this.eventListeners[eventStr].push(handler);
	}
	
}

EventEmitter.prototype.emit = function(eventStr) {
 	// iterate over array of event handlers 
  	// this.eventListeners[eventStr] calling each one, 
	// passing arguments:
	var handlerArr = this.eventListeners[eventStr];
	for(i=0;i<handlerArr.length;i++){
		var func = this.eventListeners[eventStr][i];
		func(arguments[i+1]);
	}
}

var chatServer = new EventEmitter();

//TESTS
/*chatServer.on("command",function(ele){
	console.log(ele);
});

chatServer.on("command",function(num){
	console.log(num+1);
});*/

/*chatServer.on("message", function(data) {
  	instantiateTemplate("msgTemplate", {username: data.username, msg: data.msg});
});

chatServer.emit("command","a",2);
*/