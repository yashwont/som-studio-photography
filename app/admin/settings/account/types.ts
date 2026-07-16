export type ChangePasswordState = {
  error: string | null;
  success: boolean;
};

export const initialChangePasswordState: ChangePasswordState = {
  error: null,
  success: false,
};
