const { JSDOM } = require('jsdom')
function normalizeURL(url) {
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) == "/") {
        fullPath = fullPath.slice(0, -1)
    }

    return fullPath
}
function getURLsFromHTML(htmlBody, baseURL) {
    let htmlBodyJSDOM = new JSDOM(htmlBody)
    let urls = htmlBodyJSDOM.window.document.querySelectorAll("a")
    urls = Array.from(urls)
    let finalUrls = []
    for (let i = 0; i < urls.length; i++) {
        let href = urls[i].getAttribute('href')
        if (!href.includes("http") && href[0] == "/" || href.includes("http")) {
            finalUrls.push(new URL(href, baseURL).toString())
        } 
    }

    return finalUrls
}
async function crawlPage(baseURL, currentURL, pages) {
    let baseURLOBJ = new URL(baseURL)
    let currentURLOBJ = new URL(currentURL)
    if (currentURLOBJ.hostname != baseURLOBJ.hostname) {
        return pages
    }
    let normalizedURL = normalizeURL(currentURL)
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL] += 1
        return pages
    } 

    if (currentURL == baseURL) { 
        pages[normalizedURL] = 0
    } else {
        pages[normalizedURL] = 1
    }
    console.log(`currentURL ${normalizedURL}`)
    try {
        const response = await fetch(currentURL)
        console.log(response.status)
        if (response.status >= 400) {
            console.log(`error code ${response.status}`)
            return pages
        }
        const contentType = response.headers.get("content-type")
        if (!contentType.includes('text/html')) {
            console.log(`non hmtl response ${contentType}`)
            return pages
        }
        let text = await response.text()
        let links = getURLsFromHTML(text, baseURL)
        for (link of links) {
            pages = await crawlPage(baseURL, link, pages)
        }
    } catch (e) {
        console.log(e.message)
    }
    return pages
}
function printReport(pages) {
    let entries = Object.entries(pages)
    entries.sort((a,b) => b[1] - a[1])
    for (entry of entries) {
        console.log(`Found ${entry[1]} internal links to ${entry[0]}`)
    }
}   
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    printReport
  }