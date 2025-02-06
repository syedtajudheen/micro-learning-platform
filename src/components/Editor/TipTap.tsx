import { BubbleMenu, useEditor, EditorContent, EditorEvents } from '@tiptap/react';
import styled from 'styled-components';
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"
import { ToggleGroup } from '../ui/toggle-group';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { defaultExtensions } from './extensions/extensions';
import { NodeSelector } from './BubbleSelector/NodeSelector';
import { useState } from 'react';

// Define your extension array
const extensions = [...defaultExtensions];

const Tiptap = ({ content, onEditorReady, onUpdate }) => {
  const editor = useEditor({
    extensions,
    content,
    onBeforeCreate: ({ editor }: EditorEvents["beforeCreate"]) => {
      onEditorReady(editor);
    },
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      onUpdate(content);
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkButtonClick = (mark: string) => {
    switch (mark) {
      case 'bold':
        editor?.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor?.chain().focus().toggleItalic().run();
        break;
      case 'strike':
        editor?.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor?.chain().focus().toggleCode().run();
        break;
      case 'underline':
        editor?.chain().focus()?.toggleUnderline().run();
        break;
      default:
        break;
    }
  };

  return (
    <Wrapper className='tiptap-editor'>
      <EditorContent editor={editor} style={{ width: '100%', height: '100%' }} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bubble-menu">
            <div className="flex items-center space-x-1 rounded-md border bg-white p-1 shadow-sm">
              <ToggleGroup type="multiple" size="sm">
                <NodeSelector editor={editor} open={isOpen} onOpenChange={() => setIsOpen(!isOpen)} />

                <Button
                  className="h-6 w-6"
                  variant={editor.isActive('bold') ? 'default' : 'ghost'}
                  size="icon"
                  value="bold" aria-label="Toggle bold"
                  onClick={() => handleMarkButtonClick('bold')}
                >
                  <Bold />
                </Button>
                <Button
                  className="h-6 w-6"
                  variant={editor.isActive('italic') ? 'default' : 'ghost'}
                  size="sm"
                  value="italic" aria-label="Toggle italic" onClick={() => handleMarkButtonClick('italic')}>
                  <Italic className="h-2 w-2" />
                </Button>
                <Button
                  className="h-6 w-6"
                  variant={editor.isActive('underline') ? 'default' : 'ghost'}
                  size="sm"
                  value="underline" aria-label="Toggle underline" onClick={() => handleMarkButtonClick('underline')}>
                  <Underline className="h-2 w-2" />
                </Button>
                <Button
                  className="h-6 w-6"
                  variant={editor.isActive('strike') ? 'default' : 'ghost'}
                  size="sm"
                  value="strike" aria-label="Toggle strikethrough" onClick={() => handleMarkButtonClick('strike')}>
                  <Strikethrough className="h-2 w-2" />
                </Button>
                <Button
                  className="h-6 w-6"
                  variant={editor.isActive('code') ? 'default' : 'ghost'}
                  size="sm"
                  value="code" aria-label="Toggle code" onClick={() => handleMarkButtonClick('code')}>
                  <Code className="h-2 w-2" />
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <input
                  type="color"
                  onInput={event => editor.chain().focus().setColor(event.target?.value).run()}
                  value={editor.getAttributes('textStyle').color}
                  data-testid="setColor"
                  className="w-6 h-6 ml-1 rounded-md border-0 p-0 cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md"
                />
              </ToggleGroup>
            </div>
          </div>
        </BubbleMenu>
      )}
    </Wrapper>
  );
};

export default Tiptap;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  
  /* Reset Tailwind's influence inside the editor */

  .ProseMirror {
    padding: 0;
    border: none;
    outline: none;
  }

  .drop-cursor {
    position: absolute;
    height: 2px;
    background: #3b82f6;
    pointer-events: none;
    z-index: 100;
    margin: 8px 0;
  }

  .drag-handle {
    position: fixed;
    opacity: 1;
    transition: opacity ease-in 0.2s;
    border-radius: 0.25rem;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
    background-repeat: no-repeat;
    background-position: center;
    width: 1.2rem;
    height: 1.5rem;
    z-index: 50;
    cursor: grab;

    &:hover {
      background-color: var(--novel-stone-100);
      transition: background-color 0.2s;
    }

    &:active {
      background-color: var(--novel-stone-200);
      transition: background-color 0.2s;
      cursor: grabbing;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }

    @media screen and (max-width: 600px) {
      display: none;
      pointer-events: none;
    }
  }
`;
