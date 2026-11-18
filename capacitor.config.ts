import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nicholas1990.hearthstone',
  appName: 'Hearthstone',
  webDir: 'www',
  // il server locale gira in http sulla rete di casa
  server: { androidScheme: 'http', cleartext: true },
};

export default config;
