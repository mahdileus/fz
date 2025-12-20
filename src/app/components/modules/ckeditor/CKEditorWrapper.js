"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MyUploadAdapterPlugin from "./MyUploadAdapterPlugin"

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then(m => m.CKEditor),
  { ssr: false }
);

export default function CKEditorWrapper({ value, onChange }) {
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
  }, []);

  return (
    <div className="bg-white border p-3 rounded-md min-h-[200px] text-right">
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          language: "fa",
          placeholder: "محتوا را اینجا بنویسید...",
          extraPlugins: [MyUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "imageUpload",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo",
          ],
        }}
        onChange={(event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
