import { SiteHeader }   from "@/components/public/site-header";
import { SiteFooter }   from "@/components/public/site-footer";
import { WhatsAppFab }  from "@/components/public/whatsapp-fab";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
