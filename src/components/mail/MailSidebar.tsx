import { Menu } from "lucide-react";

export default function MailSidebar() {
  return (
    <aside className="w-64 md:w-80 border-r border-border p-4 md:p-6 bg-card">
      <h2 className="text-sm font-medium mb-6 text-muted-foreground">Folders</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Inbox
              <span className="text-sm text-muted-foreground">12</span>
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Starred
              <span className="text-sm text-muted-foreground">3</span>
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Sent
              <span className="text-sm text-muted-foreground">5</span>
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Drafts
              <span className="text-sm text-muted-foreground">2</span>
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Archive
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Spam
            </button>
          </li>
          <li>
            <button className="w-full justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
              Trash
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}