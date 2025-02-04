import { useState } from "react";
import Tiptap from "@/components/Editor/TipTap";
import ToolBar from "@/components/widgets/ToolBar/ToolBar";
import Card from "@/components/card/Card";

export default function EditorPage() {
  const [editor, setEditor] = useState(null);

  return (
    <>
      <div>Editor</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <ToolBar />
        <Card>
          <Tiptap onEditorReady={setEditor} />

        </Card>
        {/* <Sidebar /> */}
      </div>
    </>
  );
};