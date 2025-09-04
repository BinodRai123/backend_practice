require("dotenv").config();
const server = require("./src/app");
const ConnectToDB = require("./src/db/db");


ConnectToDB();
server.listen(3000,() => {
    console.log("server is running on 3000 port");
})