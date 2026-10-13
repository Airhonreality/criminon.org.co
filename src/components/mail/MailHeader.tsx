import type { ReactNode } from "react";
import { folderLabel, type MailFolder } from "./types";

export default function MailHeader({
  folder,
  name,
  address,
  nav,
}: {
  folder: MailFolder;
  name: string;
  address: string;
  nav?: ReactNode;
}) {
  return (
    <header className="mb-4 rounded-md border-b border-border bg-card p-3 md:p-6">
      <div className="flex items-center gap-3">
        {nav}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-medium md:text-xl">
            Mailbox · {name}
          </h1>
          <p className="truncate text-sm text-muted-foreground">{address}</p>
        </div>
        <span className="shrink-0 text-sm font-medium">
          {folderLabel(folder)}
        </span>
      </div>
    </header>
  );
}
