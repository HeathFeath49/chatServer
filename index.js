
function sendRepeatedRequests(requested){
	var req = new XMLHttpRequest();

	req.open("GET",requested,true);
	
	req.send(null);

	req.addEventListener("load",function(){
		var data = JSON.parse(req.responseText);
		console.log(data);
		if(data.eve == "w"){
			document.getElementById("messageBoard").innerHTML += "<h1>Welcome "+data.user+"</h1>";
		}
		else if(data.eve == "m"){
			document.getElementById("messageBoard").innerHTML += "<p>"+data.user+" : " +data.msg+"</p>";	
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
	for (i=0;i<node.innerHTML.length;i++){
		if(node.innerHTML[i] == '{'){
			startI = i+1;
		}
		else if(node.innerHTML[i] == '}'){
			endI = i;
			v = node.innerHTML.slice(startI,endI);
      node.innerHTML = node.innerHTML.replace("{{"+v+"}}", data[v]);
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
	  		console.log(node.childNodes.length);
	  		console.log(cloneNode.childNoes)  cloneNode.append(deepCopyAndReplace(cloneNode.childNodes[i]));
		}
		return cloneNode;
	}
	else if(node.nodeType == document.TEXT_NODE){
		//create new text node
		newTextNode = document.createTextNode(node.innerHTML);
		editedNode = replaceText(newTextNode,dataObj);
		return editedNode;
	}
}

function instantiateTemplate(id, data) {
  var nodeToAppendData = document.getElementById(id); // msgDisplay in http://codepen.io/anon/pen/ALaEbg 
  // your code to instantiate template goes here
  var newNode = deepCopyAndReplace(nodeToAppendData,data);
  //Gotta do something with new node! 

}

//Event Emitter Class
function EventEmitter() {
 	this.eventListeners = {}; // eventName: handler
}

EventEmitter.prototype.on = function(eventStr, handler) {
	this.eventListeners[eventStr] = handler;
}

EventEmitter.prototype.emit = function(eventStr) {
 	// iterate over array of event handlers 
  	// this.eventListeners[eventStr] calling each one, 
	// passing arguments:
	for (eve in this.eventListeners){
		if(eve == eventStr){
			console.log(this.eventListeners[eventStr]);
		}
	}
}

var chatServer = new EventEmitter();

chatServer.on("message", function(data) {
  	instantiateTemplate("msgTemplate", {username: data.username, msg: data.msg});
});

