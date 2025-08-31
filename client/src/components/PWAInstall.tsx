import { useEffect, useState } from 'react';

export default function PWAInstall() {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <button className="fixed left-1/2 -translate-x-1/2 bottom-16 md:hidden bg-primary text-white px-4 py-2 rounded-full shadow z-50" onClick={async () => {
      await deferred.prompt();
      setVisible(false);
    }}>
      Install App
    </button>
  );
}
