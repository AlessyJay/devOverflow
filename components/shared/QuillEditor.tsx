"use client";

import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "../ui/button";

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [editor, setEditor] = useState<Quill | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            ["link"],
          ],
        },
      });

      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });

      setEditor(quill);
    }
  }, []);

  const handleGetContent = () => {
    if (editor) {
      alert(editor.root.innerHTML);
    }
  };

  return (
    <>
      <div ref={editorRef} className="has-[400px]:" />
      <Button onClick={handleGetContent}>Get Content</Button>
    </>
  );
};

export default QuillEditor;
