// imports specified modules
const express = require("express");
const search = require("./routes/search");

// creates express application
const server = express();

// sends specified route to "search" router
server.use("/search", search);

// listens on specified port
server.listen(3000);
