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
	/*req.addEventListener("load",function(){
		var data = JSON.parse(req.responseText);
		console.log(req.responseText);
		document.getElementById("messageBoard").innerHTML += "<p>"+data.user+" : " +data.msg+"</p>";
	})*/
}