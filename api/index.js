const playwright = require('playwright-aws-lambda')

const renderPdf = async (name) => {
  var browser = null

  browser = await playwright.launchChromium()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(`https://twitter.com`)
  const html = await page.$('html')

  return html.toString();
}

export default async function handler (req, res) {
  try {
    const { id } = req.query

    if (id === undefined) {
      throw new Error('ID parameter is missing')
    }

    const file = await renderPdf(id)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/text')
    res.setHeader('Cache-Control', 'no-cache')
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end(`<h1>Internal Error: </h1><p>${e}</p>`)
    console.error(e)
  }
}
