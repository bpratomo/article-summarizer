require('dotenv').config()
const puppeteer = require("puppeteer")

const main = async () => {
    const browser = await puppeteer.launch()
    await signIn(process.env.SECRET_EMAIL, process.env.SECRET_PASS, browser)
    await browser.close()
}

async function signIn(username: string | undefined, password: string | undefined, browser): Promise<void> {
    // Open sign in page 
    const page = await browser.newPage()
    await page.goto('https://economist.com')


    // Click sign in button 
    await page.waitForSelector('a[data-analytics="masthead:login"]')


    const loginLink = await page.$eval('a[data-analytics="masthead:login"]', el => el.href)

    await page.goto(loginLink)

    // Fill in email 

    await page.waitForSelector('input#email')
    await page.type('input#email', username)
    await Promise.all([
        page.click("button[type=submit]"),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    //  Finish login 

    await page.type('input[type="password"]', password)
    await page.screenshot({ path: 'economistlogin.png' })

    await Promise.all([
        page.click("button#submit-login"),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.screenshot({ path: 'economistpage.png' })


    
    await Promise.all([
        page.goto("https://www.economist.com/briefing/2021/07/03/the-new-variants-of-sars-cov-2-are-much-more-dangerous-to-the-unvaccinated"),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    await page.pdf({ path: 'economistHeadlineNews.pdf' })






}







main()