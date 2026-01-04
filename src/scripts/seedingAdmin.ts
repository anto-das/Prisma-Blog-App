import { prisma } from "../lib/prisma";
import { UserRole } from "../Types/role.check";

async function seedingAdmin() {
  try {
    console.log("**** admin seeding started*****");
    const adminData = {
        // admit data gula env file eh rakha best practises
      name: "Ahir Anto",
      email: "antodas2@gmail.com",
      role: UserRole.ADMIN,
      password: "admin234",
      emailVerification: true,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw Error("User already exist...");
    }

    const signUpAdmin = await fetch(
      "http://localhost:4000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    console.log("***** admin created successfully");
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    console.log("****** email verification updated");
  } catch (error) {
    console.log(error);
  }
}

seedingAdmin();
