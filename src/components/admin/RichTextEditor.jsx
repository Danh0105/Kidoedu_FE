import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillInstanceRef.current.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        onChange(html);
      });

      if (value) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, []);

  return <div ref={editorRef} />;
};

export default RichTextEditor;
