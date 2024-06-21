"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["code-block", "link", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      });
    }
  }, []);

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="quill-editor">
      <div
        ref={editorRef}
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className="ql-container ql-toolbar min-h-[400px] overflow-hidden rounded-b-sm border border-gray-300 bg-white"
      />
    </div>
  );
};

export default QuillEditor;
