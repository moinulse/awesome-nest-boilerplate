import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface IVerificationEmailProps {
  username?: string;
  verificationUrl?: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = { padding: '0 48px' };

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const text = { fontSize: '16px', lineHeight: '26px', color: '#484848' };

const buttonContainer = { padding: '27px 0 27px' };

const button = {
  backgroundColor: '#28a745',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const footer = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#9ca299',
  marginTop: '32px',
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const VerificationEmail = ({
  username = 'User',
  verificationUrl,
}: IVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={section}>
          <Heading style={heading}>Verify Your Email Address</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            Thank you for signing up! Please verify your email address by
            clicking the button below.
          </Text>
          {verificationUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email
              </Button>
            </Section>
          )}
          <Text style={text}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            The Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
