class PuppeteerManager {

    constructor(argument) {
        this.url = this.create_url(argument);
    }

    async run_puppeteer() {
        const puppeteer = require('puppeteer');	        
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-gpu",
            ]
        });
        let page = await browser.newPage();   

        await page.setRequestInterception(true)
        await page.on('request', function(request) {
            let resource_types = ["stylesheet", "font", "image", "script"];
            let resource_type = request.resourceType();
            if (resource_types.includes(resource_type)) {
                request.abort();
            }            
            else {
                request.continue();
            }
        });

        await page.goto(this.url);

        let images = await page.evaluate(function() {

            let images = document.querySelectorAll("a img");
                images = Array.from(images);
                images = images.filter(function(image) {
                    let hyperlink = image.closest("a").href;
                    return hyperlink.includes("/photos/");
                });
                images = images.map(function(image) {
                    let url = image.src;
                        url = url.split("?");
                        url = url[0];
                    return url;
                });

            return images;

        });

        await this.sleep(1000);

        await browser.close();

        return images;

    }

    create_url(argument) {
        let base = "https://unsplash.com";
        let path = "/s/photos/";
        let keywords = argument.replace(" ", "-");
        let query = "?order_by=latest&orientation=landscape";
        return base + path + keywords + query;
    }

    sleep(milliseconds) {
        return new Promise(function(resolve) {
            setTimeout(resolve, milliseconds)
        });
    }

    async get_recent_images() {
        return await this.run_puppeteer();
    }

}

module.exports = PuppeteerManager;
