import { FOLDERS, type MailFolder } from "./types";

export default function MailSidebar({
  folder,
  onSelectFolder,
}: {
  folder: MailFolder;
  onSelectFolder: (folder: MailFolder) => void;
}) {
  return (
    <aside className="w-full md:w-56 shrink-0 border rounded-md bg-card p-2">
      <nav>
        <ul className="space-y-1">
          {FOLDERS.map((f) => (
            <li key={f.key}>
              <button
                onClick={() => onSelectFolder(f.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  folder === f.key
                    ? "bg-stone-900 text-stone-50"
                    : "hover:bg-stone-100 text-stone-700"
                }`}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
