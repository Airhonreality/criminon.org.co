"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface MailListEmail {
  id: string;
  messageId: string;
  sender: string;
  recipient: string;
  subject: string;
  bodyText: string;
  folder: string;
  isRead: boolean;
  createdAt: Date;
}

export default function MailList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [folder, setFolder] = useState(() => searchParams.get("folder") || "INBOX");
  const [emails, setEmails] = useState<MailListEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/emails?folder=${folder}`, {
          credentials: "include",
        });
        const data = await res.json();
        setEmails(data.data || []);
      } catch (err) {
        console.error("Error fetching emails:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, [folder]);

  return (
    <div className="border rounded-md p-4 bg-card h-[500px]">
      {!emails.length && folder === "INBOX" ? (
        <p className="text-sm text-muted-foreground">No hay mensajes en Inbox</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              className="p-2 rounded-md border border-pointer cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/mail/${email.id}`)}
            >
              <div className="flex justify-between align-items-start">
                <span className="text-sm font-medium truncate w-64">
                  {email.subject}
                </span>
                <span className="text-xs text-muted-foreground">
                  {email.isRead ? "Leído" : "No leído"}
                </span>
              </div>
              <div className="flex text-xs text-muted-foreground">
                <span>{email.sender}</span>
                <span>{email.folder}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}