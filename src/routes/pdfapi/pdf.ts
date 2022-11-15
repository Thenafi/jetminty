import express from 'express';
const router = express.Router()

router.get('/', async (req, res) => {
    res.send('At PDF route')
}
)

module.exports = router