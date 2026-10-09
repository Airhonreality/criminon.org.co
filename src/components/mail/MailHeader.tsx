import { folderLabel, type MailFolder } from "./types";

export default function MailHeader({ folder }: { folder: MailFolder }) {
  return (
    <header className="border-b border-border bg-card p-4 md:p-6 mb-4 rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Mailbox</h1>
          <p className="text-sm text-muted-foreground">
            contacto@criminoncolombia.org
          </p>
        </div>
        <span className="text-sm font-medium">{folderLabel(folder)}</span>
      </div>
    </header>
  );
}
