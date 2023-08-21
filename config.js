const mongoose  = require("mongoose");


mongoose.connect('mongodb+srv://singhsaheb337:Booksharing_platform@cluster0.ljrg8um.mongodb.net/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var server = mongoose.connection;

server.on("connected", function () {
  console.log("Successfully connected to MongoDB !!!");
});
server.on("disconnected", function () {
  console.log("Successfully disconnected to MongoDB !!!");
});
server.on("error", console.error.bind(console, "connection error:"));
// mongoose.connection()