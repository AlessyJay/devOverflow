/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
// eslint-disable-next-line no-unused-vars
import Underline from "@tiptap/extension-underline";

interface TiptapEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const Tiptap: React.FC<TiptapEditorProps> = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing your content here...",
      }),
      Link.configure({
        openOnClick: false,
      }),
      BulletList,
      OrderedList,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Blockquote,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Image,
      CodeBlock,
    ],
    content,
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      // Example: Use the App ID in some way
      const appId = process.env.NEXT_PUBLIC_APP_ID;
      console.log("App ID:", appId);
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className="w-4xl">
      <div className="editor-toolbar mb-4 flex space-x-2 rounded-md bg-gray-100 p-2 shadow-sm">
        <button
          onClick={(e) => {
            editor?.chain().focus().toggleBold().run();
            e.preventDefault();
          }}
          className={`rounded-md px-4 py-2 transition ${editor?.isActive("bold") ? "bg-gray-200" : "bg-white"} hover:bg-gray-200`}
        >
          Bold
        </button>
        <button
          onClick={(e) => {
            editor?.chain().focus().toggleItalic().run();
            e.preventDefault();
          }}
          className={`rounded-md px-4 py-2 transition ${editor?.isActive("italic") ? "bg-gray-200" : "bg-white"} hover:bg-gray-200`}
        >
          Italic
        </button>
        <button
          onClick={(e) => {
            editor?.chain().focus().toggleUnderline().run();
            e.preventDefault();
          }}
          className={`rounded-md px-4 py-2 transition ${editor?.isActive("underline") ? "bg-gray-200" : "bg-white"} hover:bg-gray-200`}
        >
          Underline
        </button>
        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setLink({ href: "https://tiptap.dev" })
              .run()
          }
          className="rounded-md bg-white px-4 py-2 transition hover:bg-gray-200"
        >
          Add Link
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none rounded-md border border-gray-200 bg-white p-4 shadow-sm"
      />
    </div>
  );
};

export default Tiptap;
