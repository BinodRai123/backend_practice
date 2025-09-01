const server = require("./src/app");
const ConnecttoDB = require("./src/db/db");



ConnecttoDB();
server.listen(3000, ()=> {
    console.log("server is running in port 3000");
})