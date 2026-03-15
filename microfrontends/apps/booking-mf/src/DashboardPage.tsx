import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  cancelReservation,
  getProviders,
  getSlots,
  reserveSlot,
  seedSlots,
  type Slot
} from '@mf/shared-api';
import { clearAuth, getAuth } from '@mf/shared-auth';

export default function DashboardPage() {
  const nav = useNavigate();
  const auth = getAuth();

  const [providers, setProviders] = useState<string[]>([]);
  const [provider, setProvider] = useState<string>('fitnes');

  // slots = termini za izbran provider (tabela levo)
  const [slots, setSlots] = useState<Slot[]>([]);
  // allSlots = termini za vse providerje (za “Moje rezervacije” desno)
  const [allSlots, setAllSlots] = useState<Slot[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const styles = useMemo(() => {
    const card: React.CSSProperties = {
      background: '#fff',
      border: '1px solid #e7e7e7',
      borderRadius: 14,
      padding: 14,
      boxShadow: '0 6px 24px rgba(0,0,0,0.06)'
    };

    const btn: React.CSSProperties = {
      border: '1px solid #ddd',
      background: '#fff',
      padding: '8px 12px',
      borderRadius: 10,
      cursor: 'pointer'
    };

    const btnPrimary: React.CSSProperties = {
      ...btn,
      background: '#111827',
      borderColor: '#111827',
      color: '#fff'
    };

    const pill = (bg: string, color: string): React.CSSProperties => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 999,
      background: bg,
      color,
      fontSize: 12,
      fontWeight: 600
    });

    return { card, btn, btnPrimary, pill };
  }, []);

  async function refreshSlots(nextProvider?: string) {
    setLoading(true);
    setErr(null);
    try {
      const data = await getSlots(nextProvider ?? provider);
      setSlots(data);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function refreshAllSlots() {
    // Moje rezervacije naj pokaže vse rezervirane termine (čez vse providerje)
    if (!providers.length) return;
    try {
      const lists = await Promise.all(providers.map(p => getSlots(p)));
      setAllSlots(lists.flat());
    } catch (e: any) {
      // ne blokiraj UI, samo pokaži napako
      setErr(e.message ?? String(e));
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const p = await getProviders();
        setProviders(p);
        const nextProvider = p.length && !p.includes(provider) ? p[0] : provider;
        if (nextProvider !== provider) setProvider(nextProvider);

        // takoj naloži tudi allSlots
        const lists = await Promise.all(p.map(x => getSlots(x)));
        setAllSlots(lists.flat());
      } catch (e: any) {
        setErr(e.message ?? String(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const myReservations = useMemo(() => {
    if (!auth) return [];
    // vzemi VSE termine čez providerje, filtriraj moje
    const mine = allSlots.filter(s => s.reservedByUserId === auth.userId);

    // sort po začetku
    mine.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    return mine;
  }, [allSlots, auth]);

  async function onReserve(slotId: string) {
    if (!auth) return;
    setLoading(true);
    setErr(null);
    try {
      await reserveSlot(slotId, auth.userId, auth.email);
      await Promise.all([refreshSlots(), refreshAllSlots()]);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onCancel(slotId: string) {
    if (!auth) return;
    setLoading(true);
    setErr(null);
    try {
      await cancelReservation(slotId, auth.userId);
      await Promise.all([refreshSlots(), refreshAllSlots()]);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onSeed() {
    setLoading(true);
    setErr(null);
    try {
      await seedSlots();
      await Promise.all([refreshSlots(), refreshAllSlots()]);
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuth();
    nav('/login', { replace: true });
  }

  function StatusBadge({ reserved, mine }: { reserved: boolean; mine: boolean }) {
    if (!reserved) return <span style={styles.pill('#e8fff1', '#0f7a3a')}>● Prosto</span>;
    if (mine) return <span style={styles.pill('#eef2ff', '#3730a3')}>● Rezervirano (ti)</span>;
    return <span style={styles.pill('#fff1f2', '#9f1239')}>● Zasedeno</span>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(1200px 600px at 20% 0%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(1000px 500px at 100% 20%, rgba(16,185,129,0.10), transparent 55%), #f7f7fb',
        padding: 24,
        fontFamily: 'system-ui, Arial'
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            marginBottom: 14
          }}
        >
          <div>
            <h1 style={{ margin: 0, letterSpacing: -0.4 }}>BookIt</h1>
            <div style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>
              Upravljanje terminov in rezervacij
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>
              {auth?.name}{' '}
              <span style={{ color: '#6b7280', fontWeight: 500 }}>({auth?.email})</span>
            </div>
            <button onClick={logout} style={{ ...styles.btn, marginTop: 8 }}>
              Odjava
            </button>
          </div>
        </div>

        {err && (
          <div
            style={{
              background: '#ffe5e5',
              padding: 12,
              borderRadius: 12,
              marginBottom: 14,
              border: '1px solid #ffcaca'
            }}
          >
            {err}
          </div>
        )}

        {/* Filter bar */}
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ color: '#374151', fontWeight: 600 }}>Storitev</label>

              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  background: '#fff'
                }}
              >
                {providers.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button onClick={() => refreshSlots()} disabled={loading} style={styles.btn}>
                Osveži termine
              </button>

              <button
                onClick={() => refreshAllSlots()}
                disabled={loading}
                style={styles.btn}
                title="Osveži seznam vseh rezervacij"
              >
                Osveži moje rezervacije
              </button>
            </div>

            {loading && <div style={{ color: '#6b7280' }}>Nalaganje…</div>}
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: 14,
            alignItems: 'start'
          }}
        >
          {/* Left: slots */}
          <div style={styles.card}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <h2 style={{ margin: 0 }}>Termini</h2>
              <div style={{ color: '#6b7280', fontSize: 13 }}>
                Provider: <b style={{ color: '#111827' }}>{provider}</b>
              </div>
            </div>

            <div style={{ marginTop: 10, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 10 }}>
                      Začetek
                    </th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 10 }}>
                      Konec
                    </th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 10 }}>
                      Status
                    </th>
                    <th style={{ borderBottom: '1px solid #eee', padding: 10 }} />
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => {
                    const reserved = !!s.reservedByUserId;
                    const mine = !!auth && s.reservedByUserId === auth.userId;

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                        <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                          {new Date(s.startsAt).toLocaleString()}
                        </td>
                        <td style={{ padding: 10, whiteSpace: 'nowrap' }}>
                          {new Date(s.endsAt).toLocaleString()}
                        </td>
                        <td style={{ padding: 10 }}>
                          <StatusBadge reserved={reserved} mine={!!mine} />
                        </td>
                        <td style={{ padding: 10, textAlign: 'right' }}>
                          {!reserved && (
                            <button
                              disabled={loading}
                              onClick={() => onReserve(s.id)}
                              style={styles.btnPrimary}
                            >
                              Rezerviraj
                            </button>
                          )}
                          {reserved && mine && (
                            <button
                              disabled={loading}
                              onClick={() => onCancel(s.id)}
                              style={styles.btn}
                            >
                              Prekliči
                            </button>
                          )}
                          {reserved && !mine && (
                            <button
                              disabled
                              style={{ ...styles.btn, opacity: 0.6, cursor: 'not-allowed' }}
                            >
                              Zasedeno
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {slots.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} style={{ padding: 14, color: '#6b7280' }}>
                        Ni terminov za izbranega ponudnika.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: my reservations */}
          <div style={styles.card}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <h2 style={{ margin: 0 }}>Moje rezervacije</h2>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{myReservations.length}</div>
            </div>

            <div style={{ marginTop: 10 }}>
              {myReservations.length === 0 ? (
                <div style={{ color: '#6b7280' }}>Nimaš rezervacij.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {myReservations.map(s => (
                    <div
                      key={s.id}
                      style={{
                        border: '1px solid #eee',
                        borderRadius: 12,
                        padding: 12,
                        background: '#fafafa'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                            {s.provider}
                          </div>
                          <div style={{ color: '#374151', marginTop: 4 }}>
                            {new Date(s.startsAt).toLocaleString()}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>
                            do {new Date(s.endsAt).toLocaleString()}
                          </div>
                        </div>

                        <button
                          disabled={loading}
                          onClick={() => onCancel(s.id)}
                          style={styles.btn}
                        >
                          Prekliči
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Seed button (bottom-right) */}
        <button
          onClick={onSeed}
          disabled={loading}
          title="Seed terminov"
          style={{
            position: 'fixed',
            right: 22,
            bottom: 22,
            padding: '12px 14px',
            borderRadius: 999,
            border: '1px solid #111827',
            background: '#111827',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 14px 36px rgba(17,24,39,0.25)'
          }}
        >
          + Seed terminov
        </button>
      </div>
    </div>
  );
}
