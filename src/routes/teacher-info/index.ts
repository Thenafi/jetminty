import express, { Request, Response } from 'express';
const dotenv = require("dotenv");
import * as fs from 'fs';
import * as path from 'path';
const axios = require("axios");
const cheerio = require("cheerio");
const urlValidator = require("validator/lib/isURL");
const lodash = require("lodash");
var stringSimilarity = require("string-similarity");
const { NlpManager } = require("node-nlp");
const { url } = require("inspector");
import moment from 'moment';
import { getURLs, scrapeURL } from "./scraping-functions.js"





let manager = new NlpManager({ languages: ["en"], forceNER: true });
dotenv.config();
const router = express.Router()

let teacherData: String;
fs.readFile(path.join(__dirname, '/data/data.json'), 'utf8', (error, data) => {
    if (error) return console.log(error)
    teacherData = JSON.parse(data)
})

router.get('/', async (req, res) => {
    res.send('At Teacher Router route')
}
)

router.get('/get-data', async (req, res) => {
    res.json(teacherData)
}
)
router.get('/check-time', async (req, res) => {

    res.send(String(moment().format()))
}
)

// router.get('/scrape', async (req, res) => {
//     const resultDate = moment(await redis.get("lastScraped"))
//     const todaysDate = moment()
//     console.log(resultDate, todaysDate)
//     const duration = moment.duration(todaysDate.diff(resultDate)).as('seconds');
//     console.log(duration)

//     if (duration > 10) res.sendStatus(401)


//     getURLs().then((urls) => {
//         for (let i = 0; i < urls.length; i++) {
//             const element = urls[i];


//         }

//     })


// }
// )

module.exports = router