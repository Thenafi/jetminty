import { Prisma, PrismaClient, Student, Version } from '@prisma/client'
import express from 'express'
const multer = require('multer');
const cors = require('cors');
const upload = multer();
const morgan = require('morgan')
const pdfapiRouter = require('./routes/pdfapi/pdf');

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined'))
app.use(cors());
app.use('/pdfapi', pdfapiRouter);

// solve for bigint to json error
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


app.get('/', async (req, res) => {
  res.send('Meow')
})

app.get('/console', async (req, res) => {
  console.log(req)
  res.send("console")
})
  .post('/console', upload.none(), async (req, res) => {
    console.log(req.body)
    res.send("console")
  })


app.get('/students', async (req, res) => {
  console.log(req.query)
  const skip: number = req.query.page ? parseInt(req.query.page as string) - 1 : 0
  const take: number = req.query.size ? parseInt(req.query.size as string) : 100
  const filter: { field: string, type: string, value: string }[] = req.query.filter ? req.query.filter as [] : []
  const filterArray: any[] = []
  for (let i = 0; i < filter.length; i++) {
    const element = filter[i];
    if (element.type === '=') {
      filterArray.push({
        [element.field]: {
          equals: parseInt(element.value) ? parseInt(element.value) : element.value
        }

      })


    } else if (element.type === 'like') {
      filterArray.push({
        [element.field]: {
          contains: element.value
        }

      })
    }

  }
  console.log(filterArray)
  const totalStudent = await prisma.student.count()

  const users = await prisma.student.findMany({
    skip: skip,
    take: take,
    where: {
      AND: filterArray
    }
  })
  res.json({ last_page: totalStudent / take, data: users })
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

app.get('/update_api/:id', upload.none(), async (req, res) => {
  const id = req.params.id;
  const student = await prisma.student.findUnique({
    where: {
      id: id
    }
  })
  if (student) {
    try {
      res.json(student)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }
  else {
    res.status(404).json({ message: "Student not found" })
  }
})
app.post('/update_api/:id', upload.none(), async (req, res) => {
  const id = req.params.id;
  const student = await prisma.student.findUnique({
    where: {
      id: id
    }
  })
  const aStudentPrev: Prisma.VersionUncheckedCreateInput = {
    name: student?.name,
    batch: student?.batch,
    dept: student?.dept,
    sec: student?.sec,
    bloodGroup: student?.bloodGroup,
    homeTown: student?.homeTown,
    phoneNumber: student?.phoneNumber,
    email: student?.email,
    socialLink: student?.socialLink,
    active: student?.active,
    avatarLink: student?.avatarLink,
    studentId: student?.id,
    gender: student?.gender,
    clg: student?.clg,
    birthday: student?.birthday,
  }
  if (student) {
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
      const studentPrev = await prisma.version.create({ data: aStudentPrev })
      const student = await prisma.student.update({
        where: {
          id: req.body.clid
        }
        ,
        data: aStudent,
      })
      res.json(student)
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  }
  else {
    res.status(404).json({ message: "Student not found" })
  }
})


app.get("/getSingleStudent/:id", async (req, res) => {
  const id = req.params.id;
  const student = await prisma.student.findUnique({
    where: {
      id: id
    }
    , include: {
      versions: true
    }
  })
  res.json(student)
})



//junk 
// future plan
app.get('/students2', async (req, res) => {
  const totalStudent = await prisma.student.count()
  console.log(totalStudent)
  const firstQueryResults = await prisma.student.findMany({
    take: 1000,
    where: {

    },
    orderBy: {
      id: 'asc',
    },
  })
  const lastPostInResults = firstQueryResults[3] // Remember: zero-based index! :)
  const myCursor = lastPostInResults.id // Example: 29\
  res.send(firstQueryResults)
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



const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}`),
)