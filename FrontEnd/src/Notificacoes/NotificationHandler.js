import { useEffect } from 'react';

function NotificationHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BBH2oyhNjmKPnyR140S375tVHFM1wuSd7GW7ijm90Ja7NB2eX67YQRbDLVyW_QrLqiDpbIy9QecaBDC_K1AWCro',
        }).then((subscription) => {
          fetch('http://localhost:3001/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              id_cliente: localStorage.getItem('id_cliente') || null,
              id_passeador: null,
            }),
          });
        });
      });
    }
  }, []);

  return null;
}

export default NotificationHandler;