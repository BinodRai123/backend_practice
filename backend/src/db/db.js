const mongoose = require("mongoose");
const url = process.env.DATABASE_URL;


function ConnecttoDB(){
    mongoose.connect(url).then(() => {
        console.log("DataBase is connected");
    })
}


module.exports = ConnecttoDB;