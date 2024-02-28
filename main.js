const {crawlPage, printReport} = require('./crawl.js')
async function main() {
    const {argv} = require('node:process');
    if (argv.length < 3) {
        console.log("missing argument")
        return
    } else if (argv.length > 3) {
        console.log("too many args")
        return
    } 

    const baseURL = argv[2] 
    console.log(`starting crawler of ${baseURL}`)
    pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)

}
main()