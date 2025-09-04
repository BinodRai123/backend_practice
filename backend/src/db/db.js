const mongoose = require("mongoose");

function ConnectToDB(){
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("DB is connected");
    })
}


module.exports = ConnectToDB;