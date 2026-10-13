"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import MailSidebar from "./MailSidebar";
import type { MailFolder } from "./types";

export default function MailNavDrawer({
  folder,
  onSelectFolder,
}: {
  folder: MailFolder;
  onSelectFolder: (folder: MailFolder) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir navegación"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 md:hidden"
        >
          <Menu size={20} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[58] bg-stone-900/40 backdrop-blur-sm md:hidden" />
        <Dialog.Content className="fixed left-0 top-0 z-[59] h-full w-64 max-w-[80%] overflow-y-auto border-r bg-white p-3 shadow-xl focus:outline-none md:hidden">
          <div className="mb-2 flex items-center justify-between px-2">
            <Dialog.Title className="text-sm font-semibold">Carpetas</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar navegación"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          <MailSidebar
            folder={folder}
            onSelectFolder={(f) => {
              onSelectFolder(f);
              setOpen(false);
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
