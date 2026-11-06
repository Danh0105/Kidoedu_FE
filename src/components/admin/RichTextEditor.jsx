import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange, isOpen }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    quill.on("text-change", () => {
      const html = editorRef.current.querySelector(".ql-editor")?.innerHTML;
      onChange(html);
    });

    quillRef.current = quill;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value) {
      const editor = quillRef.current.root.innerHTML;
      if (editor !== value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  // ⭐ TỰ ĐỘNG RESET KHI MODAL ĐÓNG
  useEffect(() => {
    if (!isOpen && quillRef.current) {
      quillRef.current.setContents([]);
      onChange("");
    }
  }, [isOpen]);

  return (
    <div className="overflow-auto" style={{ maxHeight: "350px" }}>
      <div ref={editorRef} />
    </div>
  );
};


export default RichTextEditor;
