import { PrismaClient } from "@prisma/client";

/**
 * Declare a global variable to hold the Prisma client.
 * This is necessary because Prisma client is a singleton.
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * This is the Prisma client used to interact with the database.
 * It is a singleton, meaning that it is only created once.
 * Check added to prevent Prisma from being instantiated multiple times in development.
 */
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
