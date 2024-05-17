const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const {Client,GatewayIntentBits} = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

app.use(express.json());
app.use(express.static('user'));

var userNum=0;
var messageData = [];

var text="";
var mapUser = new Map();

function getUserIP(req) {
  // Thiết lập trust proxy để lấy đúng địa chỉ IP khi chạy sau proxy
  req.app.set('trust proxy', true);

  // Lấy địa chỉ IP từ header 'x-forwarded-for' hoặc từ socket nếu không có header
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  return ip;
}

client.on("ready", ()=>{
  const channel2 = client.channels.cache.get('1240161621234417696');
  console.log(`log in as ${client.user.tag}`);
  setInterval(()=>{
    //console.log("text");
    if(text!=""){
      channel2.send(text);
      text="";
    }
  },1000);
});

client.on("messageCreate",(message)=>{
  //console.log(typeof message.channel.id);
  if(message.author.bot){
    return;
  }else if((message.content==":get data")
  &&(message.channel.id=='1238300527238971455')){
    message.reply(JSON.stringify(mapUser));
    
  }else if(message.channel.id=='1240161621234417696'){
    
    messageData.push({
      id:"",
      username: message.author.username,
      message: message.content
    });
  }
});

function collectData(req,userNum){
  const clientIP = getUserIP(req);
  const value = mapUser[String(clientIP)]==null ? Number(userNum) : (Number(mapUser[String(clientIP)])+Number(userNum));
  mapUser[String(clientIP)]=value;
}

app.get('/',(req,res)=>{
  var channel1 = client.channels.cache.get('1238300527238971455');
  res.sendFile(path.join(__dirname,'user','homepage.html'));
  channel1.send(`new user ip address:${getUserIP(req)}`);
  collectData(req,+1);
});

app.post('/',(req,res)=>{
  const {id, username, message} = req.body;
  if(id=="getData()"){
    if(messageData.length!=0){
      res.json({
        id:"add",
        username:messageData[0].username,
        message:messageData[0].message
      });
      messageData.splice(0);
    }else{
      res.json({id:"",username:"",message:""});
    }
  }else if(id=="Sent()"){
    text=username+": "+message;
  }
});

function log(time) { 
  return new Promise(res=>setInterval(res,time));
}

app.listen(10000,()=>{console.log('server đã sẵn sàng!.')});



client.login(process.env.TOKEN);
