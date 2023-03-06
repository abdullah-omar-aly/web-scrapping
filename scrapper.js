const puppeteer = require('puppeteer')
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
    const courses = []
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    await page.goto('https://www.udacity.com/courses/all')

    for (i = 1; i < 265; i++) {

        var element = await page.waitForSelector(`ul.catalog-v2_results__E2dd9 > li:nth-child(${i})`)
        var text = await page.evaluate(element => element.innerHTML, element)
        const $ = cheerio.load(text);
        const newCourse = {
            id: i,
            imageUrl: $('img.card_image__fZ2qh').attr('src'),
            title: $('.card_title__6gX9X').text(),
            summary: $('.card_summary__uxD6t').text(),
            skillsCoverd: $('.card_detailContent__PuW0b').text()?.split(',').map(elem => elem.trim()),
            reviewCount: parseInt( $('.card_reviewCount__JWHD_').text()),
            Prerequisites: $('.card_detailContent__PuW0b:last-of-type').text(),
            duration: $('.card_duration__2zXtj').text(),
            level: $('.card_level__pTLn2 ').text(),
            rating: Number($('.rating-stars_active__RCiuN ').attr('style')?.split(' ')[1].split('%')[0])
        }
        courses.push(newCourse)
    }
    console.log(courses.length)

    const obj = {
        courses
    }

    var json = JSON.stringify(obj);

    fs.writeFile('db.json', json, 'utf8', () => {
        console.log("done")
    });

    browser.close()
}
scrape()
