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


const uerInfo = {
    email: "username@163.com",
    passwd: "yourpass"
};
const pupPage = new PageObject({
    headless : false,//是否显示浏览器
    mobile: false,//是否以手机模式运行
    viewport:{width: 1200, height: 720}//浏览器窗体大小
});

(async function(){
    debug('任务开始');
    
    await pupPage.init();
    let page = pupPage.page;

    await page.goto(entryUrl,{
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });

    //login 输入用户名和密码
    await page.type('#email', uerInfo.email);
    await page.type('#password', uerInfo.passwd);
    //提交表单
    await Promise.all([
        page.$eval('#login-form', form => form.submit()),
        page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);
    
    //勾选要买的产品
    await page.goto(productUrl, {
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });
    //提交购物车
    await Promise.all([
        page.select('#attribute380', '1515'),//选择select
        page.$eval('#product_addtocart_form', form => form.submit()),
        page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);

    //结算
    await page.goto(checkoutUrl, {
        waitUntil: 'networkidle0'  // 网络空闲说明已加载完毕
    });
    //选择运输方式
    await sleep(1500);

    const shipRd = (await page.$$('input[name="shipping_method"]'))[0];
    await Promise.all([
        page.waitForResponse(ShippingUrl),//等待ajax执行完毕
        shipRd.click(),
        page.click('#shippingSave'),
        page.waitForResponse(ShippingUrl)//等待ajax执行完毕

    ]);
    //选择支付方式，下单
    await sleep(1000);

    await Promise.all([
        page.waitForResponse(ShippingUrl),
        page.click('#p_method_cashondelivery'),
    ]);

    await page.screenshot({
        path: 'oliviaso.png',
        type:'png'
    });

    browser.close();
    debug('任务结束');
    process.exit(0);//结束任务
})()