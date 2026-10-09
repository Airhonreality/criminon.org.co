"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MailComposer() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) return;
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error desconocido");
      } else {
        setSuccess(true);
        setTo("");
        setSubject("");
        setBody("");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-card max-w-2xl">
      <h2 className="text-sm font-medium mb-4">Compose</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <Input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={sending}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
        />
      </div>
      <Textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={sending}
      />
      <Button onClick={handleSend} disabled={sending || !to || !subject || !body}>
        {sending ? "Sending..." : "Send"}
      </Button>
      {success && (
        <p className="text-sm text-green-600 mt-2">Mensaje enviado correctamente.</p>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}