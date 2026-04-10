import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReminderEmailProps {
  patientName: string;
  appointmentDate: string;
  appointmentType: string;
  clinicName?: string;
}

export const ReminderEmail = ({
  patientName = "Patient",
  appointmentDate = "10 Avril 2026",
  appointmentType = "Consultation de suivi",
  clinicName = "Clinique MediCare - Fondation Chantal Biya",
}: ReminderEmailProps) => (
  <Html>
    <Head />
    <Preview>Rappel de votre rendez-vous chez MediCare</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
            {/* Note: In a real app, use an absolute URL for the image */}
            <Heading style={logo}>MediCare</Heading>
            <Text style={tagline}>{clinicName}</Text>
        </Section>
        
        <Section style={content}>
          <Heading style={h1}>Rappel de Rendez-vous</Heading>
          <Text style={text}>
            Bonjour <strong>{patientName}</strong>,
          </Text>
          <Text style={text}>
            Ceci est un rappel automatique pour votre prochain rendez-vous médical au sein de notre établissement. 
            Le suivi régulier est essentiel pour garantir la meilleure prise en charge possible.
          </Text>
          
          <Section style={appointmentBox}>
            <Text style={appointmentLabel}>Détails de votre visite :</Text>
            <Text style={appointmentDetail}>
              📅 <strong>Date :</strong> {appointmentDate}
            </Text>
            <Text style={appointmentDetail}>
              🩺 <strong>Type :</strong> {appointmentType}
            </Text>
          </Section>

          <Text style={text}>
            Si vous ne pouvez pas honorer ce rendez-vous, merci de nous contacter au plus vite pour le reporter.
          </Text>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Clinique MediCare - Unité de suivi spécialisé <br />
              Fondation Chantal Biya, Yaoundé, Cameroun
            </Text>
            <Link href="https://registre-medic.vercel.app" style={link}>
              Visiter notre portail patient
            </Link>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ReminderEmail;

const main = {
  backgroundColor: "#f4f7f9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const headerSection = {
  padding: "32px",
  backgroundColor: "#ffffff",
  borderRadius: "24px 24px 0 0",
  textAlign: "center" as const,
  borderBottom: "1px solid #eef2f6",
};

const logo = {
  color: "#ff0080", // Primary color (Rose FCB)
  fontSize: "32px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  margin: "0",
};

const tagline = {
  color: "#6b7280",
  fontSize: "10px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "4px 0 0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "0 0 24px 24px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "32px",
  margin: "0 0 24px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const appointmentBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "16px",
  padding: "24px",
  margin: "24px 0",
  border: "1px solid #f3f4f6",
};

const appointmentLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  marginBottom: "12px",
};

const appointmentDetail = {
  color: "#111827",
  fontSize: "15px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "12px 0",
};

const link = {
  color: "#ff0080",
  textDecoration: "underline",
  fontSize: "14px",
  fontWeight: "600",
};
