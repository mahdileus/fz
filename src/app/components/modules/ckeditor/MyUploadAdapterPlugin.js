export default function MyUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;

    const data = new FormData();
    data.append("upload", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (!result.url) {
      throw new Error("Upload failed");
    }

    return {
      default: result.url,
    };
  }

  abort() {}
}
