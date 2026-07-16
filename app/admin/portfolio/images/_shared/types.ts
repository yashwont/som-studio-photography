import type { BlockFieldErrors } from "@/src/lib/portfolio/story-form";

export type { BlockFieldErrors };

export type PortfolioImageFormState = {
  status: "idle" | "error" | "success";
  message: string | null;
  blockErrors: Record<string, BlockFieldErrors>;
};

export const initialPortfolioImageFormState: PortfolioImageFormState = {
  status: "idle",
  message: null,
  blockErrors: {},
};
