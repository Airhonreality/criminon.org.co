import { sendEmail } from "@/lib/resend";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MailComposer() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) return;
    setSending(true);
    try {
      await sendEmail({ to, subject, html: `<p>${body}</p>`, text: body });
    } catch (e) {
      console.error("Send error", e);
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
    </div>
  );
}