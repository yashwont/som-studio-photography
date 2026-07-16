import { prisma } from "@/src/lib/prisma";

export function getSiteSetting(key: string) {
  return prisma.siteSetting.findUnique({
    where: {
      key,
    },
  });
}

export function setSiteSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export function getSiteSettings(keys: string[]) {
  if (keys.length === 0) {
    return Promise.resolve([]);
  }

  return prisma.siteSetting.findMany({
    where: {
      key: {
        in: keys,
      },
    },
    orderBy: {
      key: "asc",
    },
  });
}
