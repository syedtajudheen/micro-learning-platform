"use client"
import React from "react";
import Editor from "./Editor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EditorPage() {

  return (
    <ProtectedRoute>
      <Editor />
    </ProtectedRoute>
  );
};
