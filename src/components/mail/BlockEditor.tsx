"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";

export default function BlockEditor({
  onChange,
  uploadFile,
}: {
  onChange: (html: string) => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const editor = useCreateBlockNote({
    uploadFile: (file: File) => uploadFile(file),
  });

  const emit = () => onChange(editor.blocksToHTMLLossy(editor.document));

  useEffect(() => {
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="border rounded-md bg-white">
      <BlockNoteView editor={editor} theme="light" onChange={emit} />
    </div>
  );
}
