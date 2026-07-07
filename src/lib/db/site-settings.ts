import { prisma } from "@/src/lib/prisma";

export function getSiteSetting(key: string) {
  return prisma.siteSetting.findUnique({
    where: {
      key,
    },
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
