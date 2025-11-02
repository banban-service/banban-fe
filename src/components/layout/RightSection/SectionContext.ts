import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Feed } from "@/types/feeds";

export const SectionContext = createContext<{
  sectionStatus: "feeds" | "comments";
  setSectionStatus: Dispatch<SetStateAction<"feeds" | "comments">>;

  targetFeed: Feed | null;
  setTargetFeed: Dispatch<SetStateAction<Feed | null>>;

  inBottomSheet?: boolean;
}>({
  sectionStatus: "feeds",
  setSectionStatus: () => {},

  targetFeed: null,
  setTargetFeed: () => {},

  inBottomSheet: false,
});