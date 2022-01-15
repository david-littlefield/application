const express = require('express');
const parser = require('body-parser');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

let current_browsers = 0
let maximum_browsers = 5

app.get("/search", async function(request, response) {
	try {
		let keywords = request.query.keywords;
		while (current_browsers == maximum_browsers) {
			await sleep(1000);
		}
		await get_images_handler(keywords).then(function(result) {
			response.send(result);
		});
	}
	catch (error) {
		response.send({ error: error.toString() });
	}
});

async function get_images_handler(keywords) {
	let puppeteer_manager = require("./puppeteer_manager");
	let puppeteer_instance = new puppeteer_manager(keywords);
	current_browsers += 1;
	try {
		let images = await puppeteer_instance.get_recent_images().then(function(result) {
			return result;
		});
		current_browsers -= 1;
		return images;
	}
	catch (error) {
		current_browsers -= 1;
		console.log(error);
	}
}

function sleep(milliseconds) {
	console.log(' Maximum number of browsers reached');
	return new Promise(function(resolve) { 
		setTimeout(resolve, milliseconds)
	});
}

app.listen(5000, function() {
	console.log(`Running on port: 5000`);
});