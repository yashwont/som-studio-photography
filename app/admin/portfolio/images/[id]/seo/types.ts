export type PortfolioSeoFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialPortfolioSeoFormState: PortfolioSeoFormState = {
  status: "idle",
  message: "",
};
