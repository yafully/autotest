const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const debug = require('debug')('spider:init');

class PageObject {
    constructor(options = {}) {
        this.headless = options.headless;
        this.mobile = options.mobile;
        this.viewport = options.viewport;
        this.args = options.args || [];
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: this.headless,
            ignoreHTTPSErrors: true,
            args: this.args
        })
        this.page = await this.browser.newPage();
        
        if(this.mobile) {
            await this.page.emulate(iPhone);
        }else{
            await this.page.setViewport(this.viewport);
        }
    }

    async close() {
        await this.browser.close()
    }
}

module.exports = PageObject;