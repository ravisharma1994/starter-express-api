const express = require('express')
const puppeteer = require('puppeteer');

const app = express();


app.get('/', async (req, res) => {
    console.log("Just got a request!")

    let searchString = req.query.value;

    const browser = await puppeteer.launch({executablePath: '/opt/render/project/src/node_modules/puppeteer/.local-chromium/linux-609904'});
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const ONE_SEC_IN_MS = 1000;

    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36')
    await page.goto('https://www.mage.space/');

    searchString = searchString || 'car' ;

    await page.type('#search-bar', searchString);

    await page.click('.icon-tabler-arrow-right');

    console.info('PAGE IS SEARCHED ===========>', searchString);

    setTimeout(async () => {
        // await page.screenshot({ path: 'test.png' });

        const IMAGE_SELECTOR = `#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img`

        let imageHref = await page.evaluate((sel) => {
            return document.querySelector(sel).getAttribute('src').replace('/', '');
        }, IMAGE_SELECTOR);
        
        console.info(imageHref);
        await browser.close();
        res.json({image : imageHref || ''})
    }, 25 * ONE_SEC_IN_MS);

});

app.get('/home', async (req, res) => {
    res.json({success : true});
});

app.listen(process.env.PORT || 3000);
