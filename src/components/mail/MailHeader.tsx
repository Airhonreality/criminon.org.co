"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MailHeader() {
  const [search, setSearch] = useState("");

  return (
    <header className="border-b border-border p-4 md:p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Mailbox</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            Search
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Inbox</Button>
        <Button variant="outline" size="sm">Starred</Button>
        <Button variant="outline" size="sm">Sent</Button>
        <Button variant="outline" size="sm">Drafts</Button>
        <Button variant="outline" size="sm">Archive</Button>
        <Button variant="outline" size="sm">Spam</Button>
        <Button variant="outline" size="sm">Trash</Button>
      </div>
    </header>
  );
}