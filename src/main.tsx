import { createRoot } from 'react-dom/client';
import { App } from './App';
import { loadDB } from './store';
import './styles.css';

void loadDB().finally(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});

// Offline support for the web version (not needed inside the Android app, which ships its files)
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => undefined); });
}
