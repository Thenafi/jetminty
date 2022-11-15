import express from 'express';
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router()

router.get('/', async (req, res) => {
    res.send('At PDF route')
}
)

module.exports = router