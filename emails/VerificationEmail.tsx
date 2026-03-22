import { fr } from "zod/locales";
import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from "@react-email/components";
import { int } from "zod";

interface VerificationEmailProps {
    username: string;
    otp: string;
}
export const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your verification code</Preview>
            <section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>Your verification code is:</Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Text>
                    If you did not request this code, please ignore this email.
                </Text>
                <Row>
                    <Button
                        href={`http://localhost:3000/verify/${username}`}
                        style={{
                            backgroundColor: "#616161",
                            color: "#ffffff",
                            padding: "12px 24px",
                            borderRadius: "4px",
                            textDecoration: "none",
                        }}
                    >
                        Verify Now
                    </Button>
                </Row>
                </section>
                 </Html>
                );
            };
