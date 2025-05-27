export const EMAIL_QUEUE = 'email';
export const FILE_PROCESSING_QUEUE = 'file-processing';
export const NOTIFICATION_QUEUE = 'notification';

export const QUEUE_JOBS = {
  EMAIL: {
    SEND_WELCOME: 'send-welcome-email',
    SEND_RESET_PASSWORD: 'send-reset-password-email',
    SEND_VERIFICATION: 'send-verification-email',
    SEND_NOTIFICATION: 'send-notification-email',
  },
  FILE: {
    PROCESS_UPLOAD: 'process-file-upload',
    GENERATE_THUMBNAIL: 'generate-thumbnail',
  },
  NOTIFICATION: {
    SEND_PUSH: 'send-push-notification',
    SEND_IN_APP: 'send-in-app-notification',
  },
} as const;
