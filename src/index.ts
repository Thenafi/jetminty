import { Prisma, PrismaClient, Student, Version } from '@prisma/client'
import express from 'express'
const multer = require('multer');
const cors = require('cors');
const upload = multer();


const prisma = new PrismaClient()
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.send('Meow')
})


app.get('/students', async (req, res) => {
  const users = await prisma.student.findMany({
    skip: 40,
    take: 10  
  })
  res.json(users)
})

app.post('/entry_api', upload.none(), async (req, res) => {
  console.log(req.body)
  let aStudent: Prisma.StudentCreateInput = {
    name: req.body.fname,
    id: req.body.clid,
    batch: +req.body.batch,
    dept: req.body.dept,
    sec: req.body.section,
    gender: req.body.gender,
    active: req.body.donor === "Yes" ? true : false,
    bloodGroup: req.body.blood,
    clg: req.body.clg,
    homeTown: req.body.htown,
    birthday: new Date(req.body.bDate),
    phoneNumber: req.body.phone,
    email: req.body.email,
    socialLink: req.body.link,
  }
  try {
    const student = await prisma.student.create({
      data: aStudent,
    })
    res.json(student)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})
app.get('/entry_api_test', upload.none(), async (req, res) => {
  for (let i = 0; i < 10; i++) {
    let aStudent: Prisma.StudentCreateInput = {
      name: "MD MAHMODUL HAQUE",
      id: `TE-1808105${i}`,
      email: `01723558696${i}@gmail`,
      batch: 8,
      dept: "TEX",
      bloodGroup: "A+",
      homeTown: "Brahmanbaria",
      socialLink: `01723558696${i}`,
      gender: "M",
      sec: "C",
      clg: "BAF SHAHEEN COLLEGE",
      active: false,
      birthday: new Date("1999-04-23"),
      phoneNumber: `01723558696${i}`
    }
    const student = await prisma.student.create({
      data: aStudent,
    })
  }
  res.json("done")
})
app.get('/entry_api_test2', upload.none(), async (req, res) => {
  let students: Prisma.StudentCreateInput[] = []
  for (let i = 1000; i < 90000; i++) {
    let aStudent: Prisma.StudentCreateInput = {
      name: "MD MAHMODUL HAQUE 01723558696${i}@gmail ",
      id: `TE-1808105${i}`,
      email: `01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail`,
      batch: 8,
      dept: "TEX",
      bloodGroup: "A+",
      homeTown: "01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail",
      socialLink: `01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail`,
      gender: "M",
      sec: "C",
      clg: "01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail",
      active: false,
      birthday: new Date("1999-04-23"),
      phoneNumber: `01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail`
    }
    students.push(aStudent)
  }
  const student = await prisma.student.createMany({
    data: [...students],
  })
  res.json(student)
})

app.get("/getSingleStudent/:id", async (req, res) => {
  const id = req.params.id;
  const student = await prisma.student.findUnique({
    where: {
      id: id
    }
  })
  res.json(student)
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}`),
)