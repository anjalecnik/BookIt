const USERS_API = import.meta.env.VITE_USERS_API as string;
const APPT_API = import.meta.env.VITE_APPOINTMENTS_API as string;

export type Slot = {
  id: string;
  provider: 'fitnes' | 'zdravnik' | 'frizer';
  startsAt: string;
  endsAt: string;
  reservedByUserId: string | null;
  reservedAt: string | null;
};

export async function authWithGoogle(idToken: string) {
  const res = await fetch(`${USERS_API}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { userId, email, name }
}

export async function getProviders(): Promise<string[]> {
  const res = await fetch(`${APPT_API}/providers`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSlots(provider?: string): Promise<Slot[]> {
  const url = new URL(`${APPT_API}/slots`);
  if (provider) url.searchParams.set('provider', provider);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function seedSlots() {
  const res = await fetch(`${APPT_API}/slots/seed`, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reserveSlot(slotId: string, userId: string, email: string): Promise<Slot> {
  const res = await fetch(`${APPT_API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId, userId, email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cancelReservation(slotId: string, userId: string): Promise<Slot> {
  const url = new URL(`${APPT_API}/reservations/${slotId}`);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
