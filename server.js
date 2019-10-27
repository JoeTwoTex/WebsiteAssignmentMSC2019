const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

// module containing main game logic
const game = require("./game");

// module that handles server routing
const routes = require('./routes');

// module that provides access to databse through a simple API
const controller = require('./controller');

async function runServer(port){

    // JTW key. Should be stored more securely in production env
    process.env["AUTHENTICATE_KEY"] = "devKey" 

    let app = express();

    // connect to databse
    console.log("Connecting to database")
    if(await controller.connect(app)) {
        console.log("conected to database")
    
        //setting up view engine
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cookieParser(process.env["AUTHENTICATE_KEY"]));
        app.use("/", routes(app));
        app.use(express.static("./public"));
        
        app.listen(port);
        console.log('Express on ' + port);
        
        console.log("Setting up game module")
        game.startGame(app)
    }
    else {
        console.log("Unable to connect to database, server will not start.")
    }
}

module.exports = { runServer }
