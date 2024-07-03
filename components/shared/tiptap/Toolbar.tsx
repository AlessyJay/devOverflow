import React from "react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Code2,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  editor: Editor | null;
  content: string;
}

const Toolbar = ({ editor, content }: Props) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="background-light900_dark300 light-border-2 flex w-full flex-wrap items-start justify-between rounded-t-md border px-2 py-1">
      <div className="flex w-full flex-wrap items-center justify-start lg:w-10/12">
        {/* Bold */}
        <Button
          className={cn(
            editor.isActive("bold")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Bold className="size-4" />
        </Button>

        {/* Italic */}
        <Button
          className={cn(
            editor.isActive("italic")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Italic className="size-4" />
        </Button>

        {/* Underline */}
        <Button
          className={cn(
            editor.isActive("underline")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          <Underline className="size-4" />
        </Button>

        {/* Strike */}
        <Button
          className={cn(
            editor.isActive("strike")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
        >
          <Strikethrough className="size-4" />
        </Button>

        {/* Heading */}
        <Button
          className={cn(
            editor.isActive("heading", { level: 2 })
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Heading2 className="size-4" />
        </Button>

        {/* Unordered */}
        <Button
          className={cn(
            editor.isActive("bulletList")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <List className="size-4" />
        </Button>

        {/* Ordered List */}
        <Button
          className={cn(
            editor.isActive("orderedList")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered className="size-4" />
        </Button>

        {/* Blockquote */}
        <Button
          className={cn(
            editor.isActive("blockquote")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
        >
          <Quote className="size-4" />
        </Button>

        {/* Code */}
        <Button
          className={cn(
            editor.isActive("codeBlock")
              ? "font-bold text-orange-500"
              : "text-dark100_light900",
          )}
          onClick={(e) => {
            e.preventDefault();
            editor.commands.setCodeBlock();
          }}
        >
          <Code2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
