import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Revisión Equipos',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: '172.30.121.102:3000',
  }
};


export default config;
