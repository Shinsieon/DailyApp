// firebase.config.ts
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getAuth as getAppAuth } from 'firebase/auth';

export const getAdminAuth = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyAAoqSF42wKBjXMLEjHLCixwuQAsZnrqLQ',
    authDomain: 'test-3fbc1.firebaseapp.com',
    databaseURL: 'https://test-3fbc1-default-rtdb.firebaseio.com',
    projectId: 'test-3fbc1',
    storageBucket: 'test-3fbc1.appspot.com',
    messagingSenderId: '429153088555',
    appId: '1:429153088555:web:a81e657e484b00d157a66e',
    measurementId: 'G-8Q9ES5P84T',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return app;
};

export const getFirebaseAppAuth = (configService: ConfigService) => {
  const firebaseConfig = {
    apiKey: configService.get<string>('firebase.apiKey'),
    authDomain: configService.get<string>('firebase.authDomain'),
    projectId: configService.get<string>('firebase.projectId'),
    storageBucket: configService.get<string>('firebase.storageBucket'),
    messagingSenderId: configService.get<string>('firebase.senderId'),
    appId: configService.get<string>('firebase.appId'),
  };

  const app = initializeApp(firebaseConfig);

  return getAppAuth(app);
};
