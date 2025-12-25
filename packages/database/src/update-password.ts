import bcrypt from "bcryptjs";

async function main() {
    console.log("Generating hash...");
    const hashedPassword = await bcrypt.hash("password", 10);
    console.log("HASH_OUTPUT:", hashedPassword);
    process.exit(0);
}

main();
