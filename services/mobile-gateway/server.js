const express = require('express');

const app = express();
app.use(express.json());

const USERS_URL = process.env.USERS_URL || 'http://users:3001';
const APPOINTMENTS_URL = process.env.APPOINTMENTS_URL || 'http://appointments:3002';

async function forwardJson(res, upstreamResponse) {
  const text = await upstreamResponse.text();
  res.status(upstreamResponse.status);
  try {
    res.json(JSON.parse(text));
  } catch {
    res.send(text);
  }
}

app.post('/mobile/login/google', async (req, res) => {
  const r = await fetch(`${USERS_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  return forwardJson(res, r);
});

app.get('/mobile/catalog/providers', async (req, res) => {
  const r = await fetch(`${APPOINTMENTS_URL}/providers`);
  return forwardJson(res, r);
});

app.get('/mobile/appointments/slots', async (req, res) => {
  const url = new URL(`${APPOINTMENTS_URL}/slots`);
  if (req.query.provider) {
    url.searchParams.set('provider', req.query.provider);
  }

  const r = await fetch(url.toString());
  return forwardJson(res, r);
});

app.post('/mobile/appointments/book', async (req, res) => {
  const r = await fetch(`${APPOINTMENTS_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slotId: req.body.slotId,
      userId: req.body.userId
    })
  });
  return forwardJson(res, r);
});

app.post('/mobile/appointments/cancel', async (req, res) => {
  const url = new URL(`${APPOINTMENTS_URL}/reservations/${req.body.slotId}`);
  url.searchParams.set('userId', req.body.userId);

  const r = await fetch(url.toString(), {
    method: 'DELETE'
  });
  return forwardJson(res, r);
});

app.listen(8081, () => {
  console.log('Mobile gateway listening on port 8081');
});
