export type AuthResult = {
  userId: string;
  email: string;
  name: string;
};

const KEY = 'bookit_auth';

export function getAuth(): AuthResult | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as AuthResult) : null;
}

export function setAuth(auth: AuthResult) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
