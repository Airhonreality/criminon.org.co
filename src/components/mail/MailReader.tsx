import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface MailReaderEmail {
  id: string;
  messageId: string;
  sender: string;
  recipient: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  attachments: Array<{ filename: string; size?: string; url?: string }>;
  folder: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: Date;
  inReplyTo?: string;
  references?: string;
  updatedAt: Date;
}

export default function MailReader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: paramId } = useParams<{ id: string }>();
  const [messageId, setMessageId] = useState(() => paramId || searchParams.get("id") || "");
  const [email, setEmail] = useState<MailReaderEmail>({
    id: "",
    messageId: "",
    sender: "",
    recipient: "",
    subject: "",
    bodyText: "",
    bodyHtml: "",
    attachments: [],
    folder: "",
    isRead: false,
    isStarred: false,
    createdAt: new Date(),
    inReplyTo: "",
    references: "",
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      if (!messageId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/emails/${messageId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setEmail(data.email || email);
        if (!email.isRead) {
          await fetch(`/api/emails/${messageId}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          });
        }
      } catch (err) {
        console.error("Error fetching email:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [messageId]);

  useEffect(() => {
    if (!email.isRead && email.id) {
      fetch(`/api/emails/${email.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    }
  }, [email.isRead, email.id]);

  if (loading) {
    return (
      <div className="border rounded-md p-4 bg-card h-[500px]">
        <p className="text-sm text-muted-foreground">Cargando mensaje...</p>
      </div>
    );
  }

  if (!email.id) {
    return (
      <div className="border rounded-md p-4 bg-card h-[500px]">
        <p className="text-sm text-muted-foreground">Mensaje no encontrado</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 bg-card h-[500px]">
      <div className="flex flex-col gap-4 h-full">
        <div>
          <span className="text-lg font-medium">{email.subject}</span>
          <div className="text-sm text-muted-foreground flex gap-4">
            <span>{email.sender}</span>
            <span>{email.recipient}</span>
            <span>{email.folder}</span>
            <span>{email.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <p className="text-sm font-medium">Cuerpo texto:</p>
          <p className="text-sm line-break-all whitespace-pre-wrap">{email.bodyText || "Sin contenido de texto"}</p>

          {email.bodyHtml ? (
            <div className="mt-2 p-2 rounded-md bg-card/50">
              <p className="text-sm font-medium">HTML (sanitizado):</p>
              <p className="text-sm line-break-all whitespace-pre-wrap">{email.bodyHtml}</p>
            </div>
          ) : null}

          {email.attachments.length > 0 ? (
            <div className="mt-2">
              <p className="text-sm font-medium">Adjuntos:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {email.attachments.map((att) => (
                  <li key={att.filename} className="text-xs">
                    {att.filename} {att.size ? `(${att.size})` : ""}
                    {att.url && (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:underline-opacity-50"
                      >
                        Ver
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}