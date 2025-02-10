"use client"
import { ContentPlayer } from "./ContentPlayer";
import StoreProvider from "../StoreProvider";

export default function ContentPlayerPage() {

  return (
    <div className="w-full h-full bg-slate-900">
      <StoreProvider>
        <ContentPlayer />
      </StoreProvider>
    </div>
  )
};
