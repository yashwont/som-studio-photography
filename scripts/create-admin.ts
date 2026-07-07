import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

type ParsedArgs = {
  email?: string;
  password?: string;
  name?: string;
  role?: "ADMIN" | "SUPER_ADMIN";
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--email" && next) {
      parsed.email = next;
      index += 1;
    } else if (current === "--password" && next) {
      parsed.password = next;
      index += 1;
    } else if (current === "--name" && next) {
      parsed.name = next;
      index += 1;
    } else if (current === "--role" && next) {
      if (next === "ADMIN" || next === "SUPER_ADMIN") {
        parsed.role = next;
      }
      index += 1;
    } else if (current.startsWith("--email=")) {
      parsed.email = current.split("=", 2)[1];
    } else if (current.startsWith("--password=")) {
      parsed.password = current.split("=", 2)[1];
    } else if (current.startsWith("--name=")) {
      parsed.name = current.split("=", 2)[1];
    } else if (current.startsWith("--role=")) {
      const value = current.split("=", 2)[1];
      if (value === "ADMIN" || value === "SUPER_ADMIN") {
        parsed.role = value;
      }
    }
  }

  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = args.email ?? process.env.ADMIN_EMAIL;
  const password = args.password ?? process.env.ADMIN_PASSWORD;
  const name = args.name ?? process.env.ADMIN_NAME ?? "Admin User";
  const role = args.role ?? (process.env.ADMIN_ROLE === "ADMIN" ? "ADMIN" : "SUPER_ADMIN");
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  if (!email || !password) {
    throw new Error("Provide ADMIN_EMAIL and ADMIN_PASSWORD or pass --email and --password.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
  });

  try {
    const passwordHash = await hashPassword(password);
    const admin = await prisma.adminUser.upsert({
      where: { email: email.toLowerCase() },
      update: {
        name,
        passwordHash,
        role,
        active: true,
      },
      create: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        role,
        active: true,
      },
    });

    console.log(`Admin user ready: ${admin.email} (${admin.role})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
