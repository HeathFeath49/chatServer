function sendRepeatedRequests(requested){
	var req = new XMLHttpRequest();

	//req.open("GET","http://localhost:8000/",true);
	req.open("GET",requested,true);
	
	req.send(null);

	req.addEventListener("load",function(){
		/*console.log('server has responded');*/
		var data = req.responseText;
		document.getElementById('messageBoard').innerHTML += data;
		sendRepeatedRequests("http://localhost:8000/");
		
	})
}