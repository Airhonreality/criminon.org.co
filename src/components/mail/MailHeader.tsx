import { folderLabel, type MailFolder } from "./types";

export default function MailHeader({
  folder,
  name,
  address,
}: {
  folder: MailFolder;
  name: string;
  address: string;
}) {
  return (
    <header className="border-b border-border bg-card p-4 md:p-6 mb-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-medium">Mailbox · {name}</h1>
          <p className="text-sm text-muted-foreground truncate">{address}</p>
        </div>
        <span className="text-sm font-medium">{folderLabel(folder)}</span>
      </div>
    </header>
  );
}
