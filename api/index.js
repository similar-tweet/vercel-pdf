const playwright = require('playwright-aws-lambda')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36'
const renderPdf = async (name, url) => {
  var browser = null

  browser = await playwright.launchChromium({headless: true})
  const context = await browser.newContext({
    userAgent: UA })
  const page = await context.newPage()
  await page.goto(url || `https://twitter.com`, { timeout: 50000 })
  const html = await page.$eval('html', e => e.outerHTML);

  return html;
}

export default async function handler (req, res) {
  try {
    const { id, url } = req.query

    if (id === undefined) {
      throw new Error('ID parameter is missing')
    }

    const file = await renderPdf(id, url)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 'no-cache')
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end(`<h1>Internal Error: </h1><p>${e}</p>`)
    console.error(e)
  }
}
