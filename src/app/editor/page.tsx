"use client"
import React from "react";
import StoreProvider from "../StoreProvider";
import Editor from "./Editor";

export default function EditorPage() {

  return (
    <StoreProvider>
      <Editor />
    </StoreProvider>
  );
};
