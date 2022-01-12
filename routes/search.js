// imports specified modules
const server = require("express");
const router = server.Router();
const App = require("../services/app.js")

// creates app object
let app = new App();

// handles incoming network traffic for "root" route
router.get("/", async function(request, response) {

    // searches unsplash for "term" query
    let urls = await app.search(request.query.term);
    
    // returns urls in http response
    response.send(urls);

});

// exports "search" router
module.exports = router;

