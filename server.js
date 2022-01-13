// imports specified modules
const express = require("express");
const App = require("./services/app");

// creates express application
const server = express();

// creates app object
let app = new App();

// handles incoming network traffic for "root" route
server.get("/search.php", async function(request, response) {

    // searches unsplash for "term" query
    let urls = await app.search(request.query.term);
    
    // returns urls in http response
    response.send(urls);

});

// listens on specified port
server.listen(3000);
