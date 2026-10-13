import MailApp from "@/components/mail/MailApp";
import { mailboxAddress, mailboxName } from "@/lib/mailbox";

export default function MailPage() {
  return <MailApp mailboxAddress={mailboxAddress} mailboxName={mailboxName} />;
}
