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

interface IPasswordResetEmailProps {
  username?: string;
  resetUrl?: string;
  expiresIn?: string;
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
  backgroundColor: '#dc3545',
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
export const PasswordResetEmail = ({
  username = 'User',
  resetUrl,
  expiresIn = '1 hour',
}: IPasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={section}>
          <Heading style={heading}>Password Reset Request</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            You requested to reset your password. Click the button below to
            create a new password.
          </Text>
          {resetUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>
          )}
          <Text style={text}>
            This link will expire in {expiresIn}. If you didn't request this,
            you can safely ignore this email.
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
