import express from 'express';
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({
        type: process.env.TYPE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
    })
}
)

module.exports = router