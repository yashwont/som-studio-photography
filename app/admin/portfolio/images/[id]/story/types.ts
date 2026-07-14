export interface BlockFieldErrors {
  general?: string;
  paragraphs?: string;
  image?: string;
  images?: Record<string, string>;
}

export interface SaveStoryState {
  status: "idle" | "error" | "success";
  message: string | null;
  blockErrors: Record<string, BlockFieldErrors>;
}

export const initialSaveStoryState: SaveStoryState = {
  status: "idle",
  message: null,
  blockErrors: {},
};
