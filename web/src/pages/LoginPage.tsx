import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authWithGoogle } from '../api';
import { getAuth, setAuth } from '../auth';

type GoogleCredentialResponse = { credential: string };

export default function LoginPage() {
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  useEffect(() => {
    if (getAuth()) nav('/app', { replace: true });
  }, []);

  useEffect(() => {
    if (!googleClientId) {
      setErr('Manjka VITE_GOOGLE_CLIENT_ID v web/.env');
      return;
    }

    const g = (window as any).google;
    if (!g?.accounts?.id) return;

    g.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (resp: GoogleCredentialResponse) => {
        try {
          setErr(null);
          const result = await authWithGoogle(resp.credential);
          setAuth(result);
          nav('/app', { replace: true });
        } catch (e: any) {
          setErr(e.message ?? String(e));
        }
      }
    });

    g.accounts.id.renderButton(document.getElementById('googleBtn'), {
      theme: 'outline',
      size: 'large',
      text: 'signin_with'
    });
  }, [googleClientId]);

  return (
    <div style={{ maxWidth: 520, margin: '64px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>BookIt</h1>
      <p>Prijavi se z Google računom.</p>

      {err && (
        <div style={{ background: '#ffe5e5', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {err}
        </div>
      )}

      <div id="googleBtn" />
    </div>
  );
}
