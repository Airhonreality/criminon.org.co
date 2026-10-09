export default function MailPage() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <h1 className="text-2xl font-medium mb-6">Mailbox</h1>
      <p className="text-sm text-muted-foreground">
        Mail API routes available at /api/emails and /api/webhooks/incoming-email.
        Use the navigation to switch between folders.
      </p>
    </main>
  );
}