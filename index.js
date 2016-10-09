function sendRepeatedRequests(){
	var req = new XMLHttpRequest();

	req.open("GET","http://localhost:8000/",true);
	req.send(null);

	req.addEventListener("load",function(){
		console.log('server has responded');
		//sendRepeatedRequests();
		var data = req.responseText;
		document.getElementById('messageBoard').innerHTML += data;
	})
}