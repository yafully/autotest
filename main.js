const PageObject = require('./steps/pupInit');
const debug = require('debug')('spider:init');
const sleep = require('util').promisify(setTimeout);
/**
 * 1.打开浏览器
 * 2.打开页面
 * 3.跳转到某个网址
 * 4.Do Something
 * 5.关闭浏览器
 * **/
const baseUrl ="http://192.168.2.61:88/";
const entryUrl = baseUrl + "customer/account/login/";
const productUrl = baseUrl + "simple-silver-stackable-promise-ring-carve-heart.html";
const checkoutUrl = baseUrl + "checkout/onepage/";
const ShippingUrl = baseUrl + "checkout/onepage/saveShippingMethod/";
const totalUrl = baseUrl + "checkout/onepage/updateTotals/";

const uerInfo = {
    email: "chris78866326@163.com",
    passwd: "78866326"
};
const pupPage = new PageObject({
    headless : false,
    mobile: false,
    viewport:{width: 1200, height: 720}
});

(async function(){
    debug('任务开始');
    
    await pupPage.init();
    let page = pupPage.page;

    await page.goto(entryUrl,{
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });

    //login
    await page.type('#email', uerInfo.email);
    await page.type('#password', uerInfo.passwd);
    
    await Promise.all([
        page.$eval('#login-form', form => form.submit()),
        page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);
    
    //add buy product to cart
    await page.goto(productUrl, {
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });

    await Promise.all([
        page.select('#attribute380', '1515'),//选择select
        page.$eval('#product_addtocart_form', form => form.submit()),
        page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);

    //checkout
    await page.goto(checkoutUrl, {
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });
    //shipping
    await sleep(1500);

    const shipRd = (await page.$$('input[name="shipping_method"]'))[0];
    await Promise.all([
        page.waitForResponse(ShippingUrl),//等待ajax执行完毕
        //page.click(rd),
        shipRd.click(),
        page.click('#shippingSave'),
        page.waitForResponse(ShippingUrl)//等待ajax执行完毕

    ]);
    //payment
    await sleep(1000);

    await Promise.all([
        page.waitForResponse(ShippingUrl),
        //payRd.click(),
        page.click('#p_method_cashondelivery'),
        //page.click('#placeorderBtn')
        // page.evaluate(() => {
        //     console.log(window.payment);
        // })
        // page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);

    await page.screenshot({
        path: 'oliviaso.png',
        type:'png'
    });

    //browser.close();
    debug('任务结束');
    //process.exit(0);//结束任务
})()