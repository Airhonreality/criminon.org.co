"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./editor.css";
import {
  useActiveStyles,
  useCreateBlockNote,
  useEditorChange,
  useEditorSelectionChange,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { es } from "@blocknote/core/locales";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  SquareCode,
  Strikethrough,
  Underline,
} from "lucide-react";

function ToolButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-stone-900 text-stone-50"
          : "text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-stone-200" aria-hidden />;
}

export default function BlockEditor({
  onChange,
  uploadFile,
}: {
  onChange: (html: string) => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const editor = useCreateBlockNote({
    dictionary: es,
    uploadFile: (file: File) => uploadFile(file),
  });

  const active = useActiveStyles(editor);
  const [block, setBlock] = useState<{ type: string; level?: number }>({
    type: "paragraph",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  const syncBlock = () => {
    const cur = editor.getTextCursorPosition().block;
    const level = (cur.props as { level?: number })?.level;
    setBlock((prev) =>
      prev.type === cur.type && prev.level === level
        ? prev
        : { type: cur.type, level }
    );
  };

  useEditorChange(() => {
    onChange(editor.blocksToHTMLLossy(editor.document));
    syncBlock();
  }, editor);
  useEditorSelectionChange(syncBlock, editor);

  // Enfoca el editor tras montar el DOM de ProseMirror (evita una carrera que
  // lanzaba "Cannot read properties of null (reading 'setSelection')").
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        editor.focus();
      } catch {
        /* el editor aún no está listo; el usuario puede hacer clic */
      }
    });
    return () => cancelAnimationFrame(id);
  }, [editor]);

  const applyType = (
    type: "paragraph" | "bulletListItem" | "numberedListItem" | "quote" | "codeBlock"
  ) => {
    editor.updateBlock(editor.getTextCursorPosition().block, { type });
    editor.focus();
  };

  const applyHeading = (level: 1 | 2 | 3) => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: "heading",
      props: { level },
    });
    editor.focus();
  };

  const toggleStyle = (style: {
    bold?: true;
    italic?: true;
    underline?: true;
    strike?: true;
    code?: true;
  }) => {
    editor.toggleStyles(style);
    editor.focus();
  };

  const addLink = () => {
    const url = window.prompt("URL del enlace:", "https://");
    if (url) {
      editor.createLink(url);
      editor.focus();
    }
  };

  const insertImage = async (file: File) => {
    const url = await uploadFile(file);
    editor.insertBlocks(
      [{ type: "image", props: { url } }],
      editor.getTextCursorPosition().block,
      "after"
    );
    editor.focus();
  };

  const isHeading = block.type === "heading";

  return (
    <div className="mail-editor h-full min-h-0">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-stone-50/80 px-3 py-1.5">
        <ToolButton
          title="Texto normal"
          active={block.type === "paragraph"}
          onClick={() => applyType("paragraph")}
        >
          <Pilcrow size={16} />
        </ToolButton>
        <ToolButton
          title="Título 1"
          active={isHeading && block.level === 1}
          onClick={() => applyHeading(1)}
        >
          <Heading1 size={16} />
        </ToolButton>
        <ToolButton
          title="Título 2"
          active={isHeading && block.level === 2}
          onClick={() => applyHeading(2)}
        >
          <Heading2 size={16} />
        </ToolButton>
        <ToolButton
          title="Título 3"
          active={isHeading && block.level === 3}
          onClick={() => applyHeading(3)}
        >
          <Heading3 size={16} />
        </ToolButton>

        <Divider />

        <ToolButton
          title="Lista con viñetas"
          active={block.type === "bulletListItem"}
          onClick={() => applyType("bulletListItem")}
        >
          <List size={16} />
        </ToolButton>
        <ToolButton
          title="Lista numerada"
          active={block.type === "numberedListItem"}
          onClick={() => applyType("numberedListItem")}
        >
          <ListOrdered size={16} />
        </ToolButton>
        <ToolButton
          title="Cita"
          active={block.type === "quote"}
          onClick={() => applyType("quote")}
        >
          <Quote size={16} />
        </ToolButton>
        <ToolButton
          title="Bloque de código"
          active={block.type === "codeBlock"}
          onClick={() => applyType("codeBlock")}
        >
          <SquareCode size={16} />
        </ToolButton>

        <Divider />

        <ToolButton
          title="Negrita"
          active={!!active.bold}
          onClick={() => toggleStyle({ bold: true })}
        >
          <Bold size={16} />
        </ToolButton>
        <ToolButton
          title="Cursiva"
          active={!!active.italic}
          onClick={() => toggleStyle({ italic: true })}
        >
          <Italic size={16} />
        </ToolButton>
        <ToolButton
          title="Subrayado"
          active={!!active.underline}
          onClick={() => toggleStyle({ underline: true })}
        >
          <Underline size={16} />
        </ToolButton>
        <ToolButton
          title="Tachado"
          active={!!active.strike}
          onClick={() => toggleStyle({ strike: true })}
        >
          <Strikethrough size={16} />
        </ToolButton>
        <ToolButton
          title="Código en línea"
          active={!!active.code}
          onClick={() => toggleStyle({ code: true })}
        >
          <Code size={16} />
        </ToolButton>

        <Divider />

        <ToolButton title="Insertar enlace" onClick={addLink}>
          <Link2 size={16} />
        </ToolButton>
        <ToolButton
          title="Insertar imagen"
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon size={16} />
        </ToolButton>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void insertImage(file);
            e.target.value = "";
          }}
        />
      </div>

      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
