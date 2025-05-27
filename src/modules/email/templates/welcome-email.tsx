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

interface IWelcomeEmailProps {
  username?: string;
  loginUrl?: string;
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

const list = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#484848',
  paddingLeft: '20px',
};

const buttonContainer = { padding: '27px 0 27px' };

const button = {
  backgroundColor: '#5469d4',
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
export const WelcomeEmail = ({
  username = 'User',
  loginUrl,
}: IWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to our platform! Get started with your new account.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={section}>
          <Heading style={heading}>Welcome to Our Platform! 🎉</Heading>
          <Text style={text}>Hello {username},</Text>
          <Text style={text}>
            We're excited to have you on board! Your account has been
            successfully created and you're ready to get started.
          </Text>
          <Text style={text}>
            Here are a few things you can do to get started:
          </Text>
          <Text style={list}>
            • Complete your profile • Explore our features • Connect with other
            users • Set up your preferences
          </Text>
          {loginUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Get Started
              </Button>
            </Section>
          )}
          <Text style={text}>
            If you have any questions, feel free to reach out to our support
            team.
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
