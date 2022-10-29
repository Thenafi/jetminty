import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.StudentCreateInput = {
    name: "MD MAHMODUL HAQUE",
    id:"TE-1808151",
    email:"nafio62346@gmail.com",
    batch:8,
    dept:"TEX",
    bloodGroup:"A+",
    homeTown:"Brahmanbaria",
    socialLink: "https://fb.com/nafio007",
    gender:"M",
    sec :"C",
    clg:"BAF SHAHEEN COLLEGE",
  active:false,
  birthday: new Date("1999-04-23"),
  phoneNumber : "01723558696"

  }


async function main() {
  console.log(`Start seeding ...`)
  
  const user = await prisma.student.create({
    data: userData,})
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })