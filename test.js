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
const baseUrl ="https://www.amazon.com/";
const productUrl = baseUrl + "dp/B074C4XZ3N?th=1&psc=1";
const checkoutUrl = baseUrl + "checkout/onepage/";
const ShippingUrl = baseUrl + "checkout/onepage/saveShippingMethod/";
const totalUrl = baseUrl + "checkout/onepage/updateTotals/";

const qqmailUrl = "https://mail.qq.com/cgi-bin/loginpage";

const uerInfo = {
    email: "111111@qq.com",
    passwd: "222222"
};
const qqInfo = {
    qq: "111111",
    passwd: "333333"
};

// const pupPage = new PageObject({
//     headless : false,
//     mobile: false,
//     viewport:{width: 1200, height: 720}
// });

const mailPage = new PageObject({
    headless : false,
    mobile: false,
    viewport:{width: 1960, height: 1080}
});

(async function(){
    debug('任务开始');
    
    // await pupPage.init();
    // let page = pupPage.page;

    // //add buy product to cart
    // await page.goto(productUrl);

    // let producData = await page.evaluate(() => {
    //     let productDetails = [];
    //     let elements = document.querySelectorAll('#a-page');
    //     elements.forEach(element => {
    //     let detailsJson = {};
    //     try {
    //         detailsJson.name = element.querySelector('h1#title').innerText;
    //         detailsJson.price = element.querySelector('#newBuyBoxPrice').innerText;
    //     } catch (exception) {}
    //     productDetails.push(detailsJson);
    //     });
    //     return productDetails;
    // });

    // console.dir(producData);
    // debug(`抓取产品：${producData[0].name}`);

    // await Promise.all([
    //     //page.select('#native_dropdown_selected_size_name', '0,B074C4XZ3N'),//选择select
    //     //page.waitForSelector('#accordionRows_feature_div'),
    //     //page.click('#add-to-cart-button', {delay: 1500}),
    //     //page.waitFor(1500),
    //     page.$eval('#addToCart', form => form.submit()),
    //     page.waitForNavigation({ waitUntil: 'networkidle0'})
    // ]);

    // //跳转登录
    // await Promise.all([
    //     page.click('#hlb-ptc-btn-native'),
    //     page.waitForNavigation({ waitUntil: 'networkidle0'})
    // ]);

    // //登录
    // await page.type('#ap_email', uerInfo.email);
    // await page.type('#ap_password', uerInfo.passwd);
    
    // await Promise.all([
    //     page.click('#signInSubmit',{delay:1}),
    //     //page.$eval('#login-form', form => form.submit()),
    //     page.waitForNavigation({ waitUntil: 'networkidle0'})
    // ]);


    await mailPage.init();
    let mpage = mailPage.page;
    await mpage.goto(qqmailUrl);

    //获取真实的登录地址
    // let uri = await mpage.evaluate(() => {
    //     let frame = document.querySelector('#login_frame');
    //     return frame.src;
    // });
    // await mpage.goto(uri);
    await mpage.waitForSelector('iframe');
    const elementHandle = await mpage.$(
        'iframe[id="login_frame"]',
    );
    const frame = await elementHandle.contentFrame();
    //QQ邮箱登录
    await Promise.all([
        frame.type('#u', qqInfo.qq, { delay: 100 }),
        frame.type('#p', qqInfo.passwd, { delay: 100 }),
        frame.click('#login_button'),
        mpage.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);
    //收件
    await Promise.all([
        mpage.click('#readmailbtn_link'),
        mpage.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);

    // await mpage.waitForSelector('iframe');
    // const mailBox = await mpage.$(
    //     'iframe[id="mainFrame"]',
    // );
    // const mailframe = await mailBox.contentFrame();
    // let code = await mpage.evaluate(() => {
    //     let miframe = document.getElementById('mainFrame');
    //     let doc = miframe.contentDocument;
    //     let unread = doc.querySelectorAll('table.bold');
    //     return unread;
    // });
    // console.log(unread.length);
    



    // await page.goto(entryUrl,{
    //     waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    // });

    // //login
    // await page.type('#email', uerInfo.email);
    // await page.type('#password', uerInfo.passwd);
    
    // await Promise.all([
    //     page.$eval('#login-form', form => form.submit()),
    //     page.waitForNavigation({ waitUntil: 'networkidle0'})
    // ]);
    

    // //checkout
    // await page.goto(checkoutUrl, {
    //     waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    // });
    // //shipping
    // await sleep(1500);

    // const shipRd = (await page.$$('input[name="shipping_method"]'))[0];
    // await Promise.all([
    //     page.waitForResponse(ShippingUrl),//等待ajax执行完毕
    //     //page.click(rd),
    //     shipRd.click(),
    //     page.click('#shippingSave'),
    //     page.waitForResponse(ShippingUrl)//等待ajax执行完毕

    // ]);
    // //payment
    // await sleep(1000);

    // await Promise.all([
    //     page.waitForResponse(ShippingUrl),
    //     page.click('#p_method_cashondelivery'),
    // ]);

    // await page.screenshot({
    //     path: 'amazon.png',
    //     type:'png'
    // });

    //browser.close();
    debug('任务结束');
    //process.exit(0);//结束任务
})()