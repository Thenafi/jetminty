import * as cheerio from 'cheerio';
import * as lodash from 'lodash'
const axios = require("axios");
const urlValidator = require("validator/lib/isURL");
var stringSimilarity = require("string-similarity");
const { NlpManager } = require("node-nlp");

let manager = new NlpManager({ languages: ["en"], forceNER: true });

const getURLs = async function () {
    try {
        const { data } = await axios.get(
            "https://niter.edu.bd/index.php/academic/faculties"
        );
        const $ = cheerio.load(data);
        const urlArray: string[] = [];
        $(".sprocket-grids-b-readon").each((index: number, ele) => {
            const url = $(ele).attr("href");
            const validated = urlValidator(url);
            if (!validated) {
                const urlFixed = "https://niter.edu.bd/" + url;
                if (urlValidator(urlFixed)) urlArray.push(urlFixed);
                else console.log("Something Wrong while making the url");
            } else {
                if (url) {
                    urlArray.push(url);
                }
            }
        });
        return lodash.sortBy(urlArray);
    } catch (error) {
        throw new Error("Fetching Url Failed")
    }
};

// check if the url is for teachers data
const scrapeURL = async function (
    url: string = "https://niter.edu.bd//index.php/academic/faculties/12-page/79-mowshumi-roy"
) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let finalData: {
        name: string,
        nameArray: string[],
        url: string,
        contactInfo: string[],
        nodeNLPEmail: string[],
        nodeNLPNumber: string[],
        nameUnique: string[],
    }

    finalData = {
        name: $("title").text().trim(),
        nameArray: [],
        url: url,
        contactInfo: [],
        nodeNLPEmail: [],
        nodeNLPNumber: [],
        nameUnique: [],
    };

    //last part slug
    const lasPart = [...url.matchAll(/[^/]+(?=\/$|$)/g)][0][0]
        .replace(/[0-9]+|-/g, " ")
        .trim();

    $("table tr")
        .find($("td"))
        .find($("[style*='font-size'], [style*='color']"))
        .each(function (index, ele) {
            let text = $(ele).text().trim();
            text = text
                .replace(/Faculty Profile|Lecturer|Assistant Professor|Professor/, "")
                .trim();
            var similarity = stringSimilarity.compareTwoStrings(
                lasPart,
                text.toLocaleLowerCase()
            );
            if (similarity < 0.8) return;

            // console.log(text, "-", lasPart, "--", similarity, $(ele).parent().html());
            finalData.nameArray.push(text);
        });
    finalData.nameUnique = lodash.uniq(finalData.nameArray);
    //time for extracting phone number
    let startingIndex = 0;

    $("[colspan] strong").each(function (index, ele) {
        if ($(ele).text().trim() !== "Contact Information") return;
        startingIndex = $(ele).parents("tr").index();

    });
    for (let i = startingIndex; i < startingIndex + 7; i++) {
        let textString: string = $("table").children("tbody").children(`tr`).eq(i).text();

        finalData.contactInfo.push(textString.trim().replace(/\n/g, " "));
    }

    const result = await manager.process(
        finalData.contactInfo
            .join(" ")
            .replace(/-/g, "")
            .replace(/\(|\)/g, "")
            .replace(/,/g, " ")
    );
    for (let i = 0; i < result.sourceEntities.length; i++) {
        const element = result.sourceEntities[i];
        if (element.typeName === "email") {
            finalData.nodeNLPEmail.push(element);
        }
    }

    for (let i = 0; i < result.sourceEntities.length; i++) {
        const element = result.sourceEntities[i];
        if (element.typeName == "phonenumber") {
            finalData.nodeNLPNumber.push(element);
        }
    }

    // console.log("===== ", finalData.name);
    //pushing final data
    return finalData
};

export { getURLs, scrapeURL }