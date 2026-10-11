"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./editor.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { es } from "@blocknote/core/locales";
import { useEffect } from "react";

export default function BlockEditor({
  onChange,
  uploadFile,
}: {
  onChange: (html: string) => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const editor = useCreateBlockNote({
    autofocus: true,
    dictionary: es,
    uploadFile: (file: File) => uploadFile(file),
  });

  const emit = () => onChange(editor.blocksToHTMLLossy(editor.document));

  useEffect(() => {
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="mail-editor h-full min-h-0">
      <BlockNoteView editor={editor} theme="light" onChange={emit} />
    </div>
  );
}
