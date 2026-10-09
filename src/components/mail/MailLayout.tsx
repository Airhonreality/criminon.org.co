import MailHeader from "./MailHeader";
import MailSidebar from "./MailSidebar";
import MailToolbar from "./MailToolbar";
import MailList from "./MailList";
import MailReader from "./MailReader";
import MailComposer from "./MailComposer";

export default function MailLayout() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <MailHeader />
      <div className="flex flex-col md:flex-row gap-4">
        <MailSidebar />
        <div className="flex-1 flex flex-col gap-4">
          <MailToolbar />
          <div className="flex-1 flex flex-col gap-2">
            <MailList />
            <MailReader />
            <MailComposer />
          </div>
        </div>
      </div>
    </div>
  );
}