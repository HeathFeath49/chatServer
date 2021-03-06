function sendRepeatedRequests(requested){
	var req = new XMLHttpRequest();

	req.open("GET",requested,true);
	
	req.send(null);

	req.addEventListener("load",function(){
		var data = JSON.parse(req.responseText);
		chatServer.emit(data.eve,data);
		sendRepeatedRequests("http://localhost:8000/");	
	})
}

function sendMessage(username,message){
	var req = new XMLHttpRequest();
	req.open("GET","http://localhost:8000/?user="+username+"&msg="+message);
	console.log('hello');
	req.send(null);
}

function replaceText(node,data){
	var startI;
	var endI;
	var v;
	for (i=0;i<node.nodeValue.length;i++){
		if(node.nodeValue[i] == '{'){
			startI = i+1;
		}
		else if(node.nodeValue[i] == '}'){
			endI = i;
			v = node.nodeValue.slice(startI,endI);
			
      		node.nodeValue = node.nodeValue.replace("{{"+v+"}}", data[v]);
		}
	}
  return node;
}

function deepCopyAndReplace(node,dataObj){
	var cloneNode;
	var newTextNode;
	var editedNode;
	
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
  var nodeToAppendData = document.getElementById(id); 
  var newNode = deepCopyAndReplace(nodeToAppendData,data);
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
	var handlerArr = this.eventListeners[eventStr];
	for(i=0;i<handlerArr.length;i++){
		var func = this.eventListeners[eventStr][i];
		func(arguments[i+1]);
	}
}

var chatServer = new EventEmitter();


chatServer.on("w",function(data){
	var welcomeHTML = instantiateTemplate("welcomeTemplate",data);
	welcomeHTML.setAttribute("id","welcomeMessage");
	welcomeHTML.removeAttribute("class");
	document.getElementById("messageBoard").append(welcomeHTML);
});

chatServer.on("m", function(data) {
  	instantiateTemplate("msgTemplate",data);
  	var elements = instantiateTemplate("msgTemplate",data);
	elements.removeAttribute("id");
	elements.removeAttribute("class");
	elements.setAttribute("class","message");
	document.getElementById("messageBoard").append(elements);	
});