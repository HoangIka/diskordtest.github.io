const bttn = document.querySelector(".send").onclick = send;
var textbox1 = document.querySelector(".text1");
var textbox2 = document.querySelector(".text2");
async function send(e){
  e.preventDefault();
  if(textbox1.value==""&&textbox2.value=="") return;
  const data = await fetch('/',{
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      id:"Sent()", username:textbox1.value, message:textbox2.value})
  }).then(res => res.json()).catch(error=>console.log(error))
  textbox1.value="";
  textbox2.value="";
}

function sleep(time){
  return new Promise(res=>setInterval(res,time));
}

async function getData(){
  while(true){
    await sleep(2500);
    await fetch('/', {
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
      body: JSON.stringify({
        id:"getData()", username:"", message:""})
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.id!="add") return;
      const pE = document.createElement("p");
      pE.classList.add("chatbox-text");
      pE.innerHTML+=String(data.username)+":<br>"+data.message;
      const chatbox = document.querySelector(".chatbox");
      chatbox.appendChild(pE);
    })
    .catch(error=>{alert("back-end server is no respond...")});
  }
}
getData();