"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Toolbar from "./Toolbar";
import { useEffect } from "react";

interface Props {
  onChange: (content: string) => void;
  content?: string;
}

const Tiptap = ({ onChange, content = "" }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "p-3 bg-blue-800 border light-border-2 rounded-sm bg-codeBlockColour",
        },
      }),
      Link,
      Underline,
      BulletList,
      OrderedList,
      Blockquote,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "p-4 text-dark100_light900 light-border-2 border min-h-[300px] focus:outline-none rounded-b-md background-light900_dark300",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div>
      <Toolbar editor={editor} content={content} />
      <EditorContent
        editor={editor}
        className="max-h-[300px] overflow-y-auto whitespace-pre-line break-words max-sm:w-full"
      />
    </div>
  );
};

export default Tiptap;
