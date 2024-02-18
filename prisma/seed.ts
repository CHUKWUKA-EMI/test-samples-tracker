import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const racks = await prisma.rack.createMany({
    data: Array(10).fill({})
  });

  const patients = await prisma.patient.createMany({
    data: [
      {
        age: 20,
        city: 'Lagos',
        company: 'Adamco',
        district: 'Lekki',
        email: 'adams@gmail.com',
        name: 'Adams Adams',
        visionDefect: 'Myopia'
      },
      {
        age: 22,
        city: 'Lagos',
        company: 'Evelyn & co',
        district: 'Obadore',
        email: 'eve@gmail.com',
        name: 'Eve Evelyn',
        visionDefect: 'Hypermetropia'
      },
      {
        age: 19,
        city: 'Abuja',
        company: 'John Doe Ltd',
        district: 'Maitama',
        email: 'john.doe@gmail.com',
        name: 'John Doe',
        visionDefect: ''
      },
      {
        age: 18,
        city: 'Warri',
        company: 'Kaikema',
        district: 'Eneri',
        email: 'kai@gmail.com',
        name: 'Kai Kai',
        visionDefect: 'Astigmatism'
      },
      {
        age: 17,
        city: 'Warri',
        company: 'Nogas Ltd',
        district: 'PTI',
        email: 'doglas@gmail.com',
        name: 'Doglas D.',
        visionDefect: 'Astigmatism'
      },
      {
        age: 25,
        city: 'Abuja',
        company: 'NoCompany.com',
        district: 'NoDistrict',
        email: 'jen@gmail.com',
        name: 'Jen Jemmy',
        visionDefect: ''
      },
      {
        age: 24,
        city: 'Asaba',
        company: 'Alakoma',
        district: 'Okpanam',
        email: 'noname@gmail.com',
        name: 'Noname Jack',
        visionDefect: 'Myopia'
      }
    ]
  });
  console.log({ racks, patients });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
