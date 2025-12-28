import app from "./app";
import { prisma } from "./lib/prisma"

const PORT = process.env.PORT || 5000;

async function main(){
    try {
        prisma.$connect();
        console.log("prisma-blog-app server connected successfully");
        app.listen(PORT,() =>console.log("this is server is running at port: ",PORT))
    } catch (error) {
        console.error("error occurred", error);
        prisma.$disconnect(),
        process.exit(1)
    }
}

main()