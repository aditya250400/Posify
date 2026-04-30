const prisma = require("../client");
const bcrypt = require("bcryptjs");

async function main() {
  const password = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      password,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
