import { Prisma, PrismaClient, Student, Version } from '@prisma/client'
import express from 'express'
const multer = require('multer');
const cors = require('cors');
const upload = multer();


const prisma = new PrismaClient()
const app = express()

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.get('/students', async (req, res) => {
  const users = await prisma.student.findMany({include:{versions:true}})
  res.json(users)
})

// app.post( '/entry_api',upload.none(), async (req, res) => {
//   console.log(req.body)
//   let aStudent:Prisma.StudentCreateInput = {
//     name: req.body.fname,
//     id:req.body.clid,
//     batch:+req.body.batch,
//     dept:req.body.dept,
//     sec:req.body.section,
//     gender:req.body.gender,
//     active:req.body.donor==="Yes"?true:false,
//     bloodGroup:req.body.blood,
//     clg:req.body.clg,
//     homeTown:req.body.htown,
//     birthday:new Date(req.body.bDate),
//     phoneNumber:req.body.phone,
//     email:req.body.email,
//     socialLink: req.body.link,
//   }
//   console.log(aStudent)
//   const student = await prisma.student.create({
//     data: aStudent,
//   })
//   res.json(student)
// })

app.get("/checkStudent/:id",cors(),async (req,res)=>{
  const id = req.params.id;
  console.log(id)
  const student = await prisma.student.findUnique({
    where:{
      id:id
    }
  })
  console.log(student)
  res.json(student)
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)