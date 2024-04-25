const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const connectDB = require("./db.js");
const entry = require("./model/entry.js");
require("dotenv").config();
connectDB();
const port = process.env.PORT || 5000;
const app = express();

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  let data_recieved=[];
  let maxi=-1e9;
  let numberofRequest=0;
  socket.on("client-message", (client) => {
    
    let data = parseInt(client.message);
    let apiKey = client.key;
    //////////////////////


    const updateEntry = async (data) => {
        const newentry = new entry({
        data: data,
      });
     

      await newentry.save();
      io.emit("server-message", "-");
    };

const getEntries= async ()=>{

  const allentries= await entry.find();
  console.log(allentries);

  if(allentries){
   
        for(let i=numberofRequest;i<allentries.length;i++){
         if(allentries[i].data>maxi){
          maxi=allentries[i].data;
         }
           data_recieved.push(allentries[i].data);
        }
      }
      numberofRequest=allentries.length
      if(maxi ===-1e9){
        io.emit('server-message','No Data')
      }else{
      io.emit('server-message',{data_recieved,maxi});
      }
}

    if (String(process.env.API_KEY) === apiKey) {
      if (data === -1) {
      getEntries();
      
    } else {
        updateEntry(data);
      }
    } else {
      io.emit("server-message", "unauthorised");
    }

  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(port, () => console.log(`Server running on ${port}`));
