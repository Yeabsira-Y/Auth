import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(request) {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
        return new NextResponse("Missing Fields", { status: 400 });
    }
    const exists = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (exists) {
        return new NextResponse("User Already Exists", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        },
    });
    return NextResponse.json(user);
}