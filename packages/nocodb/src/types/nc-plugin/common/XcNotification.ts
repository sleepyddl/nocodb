export interface XcNotification {
  type: XcNotificationType;
  payload: any;
}
export declare enum XcNotificationType {
  EMAIL = 'Email',
  URL = 'URL',
  DISCORD = 'Discord',
  TELEGRAM = 'Telegram',
  SLACK = 'Slack',
  WHATSAPP = 'Whatsapp',
  TWILIO = 'Twilio',
}
