import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Section,
    Text,
    Button,
    Container,
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Mystery Message Verification</title>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="sans-serif"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hJPdt.woff2',
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your Mystery Message verification code: {otp}</Preview>
            <Section style={main}>
                <Container style={container}>
                    {/* Header/Logo */}
                    <Section style={{ paddingBottom: '32px' }}>
                        <Heading style={logo}>Mystery <span style={logoGradient}>Message</span></Heading>
                    </Section>

                    {/* Content Section */}
                    <Section style={contentBox}>
                        <Heading as="h2" style={h2}>Hello {username},</Heading>
                        <Text style={paragraph}>
                            Welcome to <strong>Mystery Message</strong>! We&apos;re excited to have you join our community for anonymous feedback across the world.
                        </Text>
                        <Text style={paragraph}>
                            To verify your account and get started, please use the following one-time password (OTP):
                        </Text>
                        
                        {/* OTP Box */}
                        <Section style={otpBox}>
                            <Text style={otpText}>{otp}</Text>
                        </Section>

                        <Text style={paragraph}>
                            This code will expire in 1 hour. If you didn&apos;t request this, you can safely ignore this email.
                        </Text>

                        {/* Button */}
                        <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Button
                                href={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify/${username}`}
                                style={button}
                            >
                                Verify Account now
                            </Button>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Automated message from Mystery Message Platform.
                        </Text>
                        <Text style={footerText}>
                            Safe. Secure. Anonymous.
                        </Text>
                    </Section>
                </Container>
            </Section>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: "#0a0a0a",
    fontFamily: '"Inter", "HelveticaNeue", Helvetica, Arial, sans-serif',
    padding: "40px 0",
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "100%",
    maxWidth: "580px",
};

const logo = {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
    textAlign: "center" as const,
    letterSpacing: "-0.02em",
    margin: "0",
};

const logoGradient = {
    color: "#53ddfc", // Cyan
};

const contentBox = {
    backgroundColor: "#111111",
    border: "1px solid #222222",
    borderRadius: "24px",
    padding: "40px",
};

const h2 = {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    textAlign: "left" as const,
    margin: "0 0 16px",
};

const paragraph = {
    color: "#a1a1aa",
    fontSize: "15px",
    lineHeight: "24px",
    textAlign: "left" as const,
    margin: "0 0 16px",
};

const otpBox = {
    backgroundColor: "#000000",
    border: "1px solid #333333",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center" as const,
    margin: "24px 0",
};

const otpText = {
    color: "#53ddfc",
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "0.5em",
    margin: "0",
};

const button = {
    backgroundColor: "#ba9eff", // Purple
    color: "#000000",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    display: "inline-block",
};

const footer = {
    marginTop: "32px",
    textAlign: "center" as const,
};

const footerText = {
    color: "#525252",
    fontSize: "12px",
    margin: "4px 0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
};
