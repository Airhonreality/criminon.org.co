import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

const BRAND = "Criminon Colombia";
const FROM_EMAIL = "contacto@criminoncolombia.org";
const SITE_URL = "https://criminoncolombia.org";

const DEFAULT_SIGNATURE = `Saludos cordiales,
Equipo ${BRAND}
${FROM_EMAIL} · ${SITE_URL}`;

export const emailSignature = process.env.EMAIL_SIGNATURE || DEFAULT_SIGNATURE;

const styles = {
  body: {
    backgroundColor: "#f5f5f4",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "24px 0",
    margin: 0,
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #e7e5e4",
    borderRadius: "8px",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "32px",
  },
  brand: {
    color: "#1c1917",
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 4px",
  },
  brandSub: {
    color: "#78716c",
    fontSize: "12px",
    margin: "0 0 16px",
  },
  bodyText: {
    color: "#1c1917",
    fontSize: "15px",
    lineHeight: "24px",
  },
  signature: {
    color: "#57534e",
    fontSize: "14px",
    lineHeight: "22px",
    marginTop: "24px",
    whiteSpace: "pre-line" as const,
  },
  footer: {
    color: "#a8a29e",
    fontSize: "11px",
    lineHeight: "16px",
    margin: "12px 0 0",
  },
  footerLink: { color: "#a8a29e", textDecoration: "underline" },
};

export interface EmailLayoutProps {
  subject: string;
  bodyHtml: string;
  signature?: string;
}

export function EmailLayout({
  subject,
  bodyHtml,
  signature = emailSignature,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>{BRAND}</Text>
          <Text style={styles.brandSub}>{FROM_EMAIL}</Text>
          <Hr />
          <Section>
            <div
              style={styles.bodyText}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Section>
          {signature ? (
            <Text style={styles.signature}>{signature}</Text>
          ) : null}
          <Hr />
          <Row>
            <Column>
              <Text style={styles.footer}>
                Este mensaje fue enviado desde {BRAND} ·{" "}
                <Link href={SITE_URL} style={styles.footerLink}>
                  {SITE_URL}
                </Link>
              </Text>
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
  );
}

/** Renderiza el layout a HTML y a texto plano listos para Resend. */
export async function renderEmail(
  props: EmailLayoutProps
): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(<EmailLayout {...props} />),
    render(<EmailLayout {...props} />, { plainText: true }),
  ]);
  return { html, text };
}
