"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect } from "react";

export default function CKEditorWrapper({ value, onChange }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, []);

  return (
    <div className="bg-white border p-3 rounded-md min-h-[200px] text-right">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          language: "fa",
          placeholder: "محتوای  را اینجا بنویسید...",
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
            "alignment"
          ],
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:full",
              "imageStyle:side"
            ]
          },
          alignment: {
            options: ["right", "left", "center"]
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
