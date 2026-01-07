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
    <div className="bg-white border p-3 rounded-md min-h-50 text-right">
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
          heading: {
            options: [
              { model: "paragraph", title: "پاراگراف", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "تیتر ۱", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "تیتر ۲", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "تیتر ۳", class: "ck-heading_heading3" },
              { model: "heading4", view: "h4", title: "تیتر ۴", class: "ck-heading_heading4" },
              { model: "heading5", view: "h5", title: "تیتر ۵", class: "ck-heading_heading5" },
            ],
          },
        }}

        onChange={(event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
