const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
test("normalized URL", () => {
    let expectedValue = "blog.boot.dev/path/p2"
    expect(normalizeURL("https://blog.boot.dev/path/p2/")).toBe(expectedValue)
    expect(normalizeURL("https://blog.boot.dev/path/p2")).toBe(expectedValue)
    expect(normalizeURL("http://blog.boot.dev/path/p2/")).toBe(expectedValue)
    expect(normalizeURL("http://blog.boot.dev/path/p2")).toBe(expectedValue)
})
test("getURLSFROMHtml", () => {
    const htmlBody = `
    <body>
        <a href="/p1/p2"><span>Go to Boot.dev</span></a>
        <a href="/p1/p2/"><span>Go to Boot.dev</span></a>
    </body>
    `
    let baseURL = "https://blog.boot.dev"
    let expectedValue = ["https://blog.boot.dev/p1/p2","https://blog.boot.dev/p1/p2/"]
    console.log(getURLsFromHTML(htmlBody, baseURL))
    expect(getURLsFromHTML(htmlBody, baseURL)).toStrictEqual(expectedValue)
})

test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('normalizeURL http', () => {
    const input = 'http://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML absolute', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML handle error', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ ]
    expect(actual).toEqual(expected)
  })
  