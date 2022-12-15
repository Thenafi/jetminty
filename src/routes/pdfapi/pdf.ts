import express from "express";
const router = express.Router();
const dotenv = require("dotenv");
const redis = require("../../utils/db");
const { googleDocNameMaker } = require("../../utils/idmaker");
const { pdfCreator } = require("../../utils/pdfcreator");
const { listOfObjectsInBucket } = require("../../utils/buckets");

const multer = require("multer");

const upload = multer();
let googleDocNameMakerGen = googleDocNameMaker();
dotenv.config();

router.get("/", async (req, res) => {
    res.send("At PDF route");
});

router.post("/create", upload.none(), async (req: any, res: any) => {
    const data = req.body;
    const value = googleDocNameMakerGen.next().value;
    if (value === undefined) {
        googleDocNameMakerGen = googleDocNameMaker();
    }
    if (data.student_id === undefined && data.docID === undefined) {
        res.sendStatus(400);
    }
    const docName = value
        ? data.student_id + "_" + value
        : data.student_id + "_meow_23";
    const docID = data.docID;
    //remove the docID from data
    delete data.docID;

    //create the pdf
    const pdf = await pdfCreator(data, docID, docName);
    console.log(pdf);
    if (pdf) {
        res.send(pdf);
    } else {
        res.sendStatus(500);
    }
});

router.get("/created-pdf-links", async (req, res) => {
    const { studentId } = req.query;
    let pdfLinks: string[] = [];
    if (studentId) {
        pdfLinks = await listOfObjectsInBucket(
            "doremon",
            "magic_pocket/" + studentId
        );
    } else {
        pdfLinks = await listOfObjectsInBucket("doremon", "magic_pocket/");
    }
    if (pdfLinks.length === 0) {
        res.sendStatus(404);
    }
    pdfLinks = pdfLinks.map((link: any) => {
        return "https://s3.tebi.io/doremon/" + link;
    });

    pdfLinks = pdfLinks.filter((link: any) => {
        return link.includes(".pdf");
    });
    res.send(pdfLinks);
});

module.exports = router;
