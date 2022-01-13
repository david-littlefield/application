#!/usr/bin/env node

// imports specified module
const puppeteer = require("puppeteer");

// creates "app" class
class App {
    
    // creates "app" object
    constructor() {
    }

    // performs search with specified text
    async search(text) {
        try {
            await this.create_browser();
            await this.load_page();
            await this.configure_browser();
            await this.create_url(text);
            await this.open_url();
            await this.load_function();
            await this.execute_function();
            await this.close_browser();
            return this.unsplash_urls;
        }
        catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    // creates browser
    async create_browser(headless = true) {
        this.browser = await puppeteer.launch({
            headless: headless,
        });
    }

    // loads page in browser
    async load_page() {
        let pages = await this.browser.pages();
        this.page = pages[0];
    }

    // configures browser
    async configure_browser() {
        await this.disable_resources();
        await this.prevent_detection()
    }

    // disables unnecessary resources
    async disable_resources() {
        await this.page.setRequestInterception(true)
        await this.page.on('request', function(request) {
            let resource_types = ["stylesheet", "font", "image"];
            let resource_type = request.resourceType();
            if (resource_types.includes(resource_type)) {
                request.abort();
            }            
            else {
                request.continue();
            }
        });
    }

    // prevents browser from detecting puppeteer
    async prevent_detection() {
        await this.page.evaluateOnNewDocument(function() {
            delete navigator.__proto__.webdriver;
        });
    }

    // creates url from specified text
    create_url(text) {
        let base = "https://unsplash.com";
        let path = "/s/photos/";
        let term = text.replace(" ", "-");
        let query = "?order_by=latest&orientation=landscape";
        this.url = base + path + term + query;
    }

    // opens url in browser
    async open_url() {
        await this.page.goto(this.url);
    }

    // loads specified function into browser
    async load_function() {
        await this.page.addScriptTag({content: `${get_unsplash_urls}`});
    }

    // executes specified function inside browser
    async execute_function() {
        this.unsplash_urls = await this.page.evaluate(function() {
            return get_unsplash_urls();
        });
    }

    // closes browser
    async close_browser() {
        await this.browser.close();
    }

}

// parses image urls from inside browser
function get_unsplash_urls() {

    // selects all image elements nested within link elements 
    let images = document.querySelectorAll("a img");

        // creates iterable array
        images = Array.from(images);

    // parses image url from image elements
    let urls = images.map(function(image) {
        return image.src;
    });

    // returns urls
    return urls;
}

// exports "app" class
module.exports = App;

