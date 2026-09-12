# React Native integration prompt

Open your React Native / Expo project and paste **everything below the line** into Cursor as the task.

Replace `https://YOUR-DEPLOYED-NEXPEND-URL` with the live Nexpend website URL (no trailing slash). Local Android emulator can use `http://10.0.2.2:3000`. A physical phone on the same Wi‑Fi can use `http://YOUR-LAN-IP:3000`.

---

You are integrating a React Native (Expo-friendly) Android app with an existing Nexpend backend.

## Goal

Build a working Android expense app that uses the **same users and same PostgreSQL database** as the Nexpend website. Do **not** add Firebase, Supabase, AsyncStorage-only fake auth, or a local SQLite source of truth. All reads and writes go through the Nexpend REST API. A login on the phone must show the same expenses on the website, and the other way around.

## Backend (already live — do not recreate)

- API base: `https://YOUR-DEPLOYED-NEXPEND-URL/api/v1`
- Same JWT users as the website
- Token lifetime: 7 days (`expiresIn` is seconds)
- Demo login: `demo@nexpend.app` / `password123`

Put the base URL in env:

```
EXPO_PUBLIC_API_URL=https://YOUR-DEPLOYED-NEXPEND-URL
```

API calls use `${EXPO_PUBLIC_API_URL}/api/v1/...`.

If testing HTTP (not HTTPS) on Android, enable cleartext traffic.

## Auth rules

1. `POST /api/v1/auth/register` and `POST /api/v1/auth/login` return:

```json
{
  "ok": true,
  "token": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 604800,
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "name": "Aniket",
    "imageUrl": null,
    "monthlyIncome": 40000,
    "savingsGoal": 5000,
    "onboardingComplete": false,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

2. Store `token` in `expo-secure-store` (not AsyncStorage).
3. On every protected request send:

```
Authorization: Bearer <token>
Content-Type: application/json
```

4. If a request returns `401`, delete the token and send the user to Sign In.
5. After login: if `user.onboardingComplete === false`, show Onboarding (monthly income + savings goal). Otherwise show Home.
6. Logout = delete the stored token (optional `POST /api/v1/auth/logout`).

## Endpoints

Unprotected:

- `GET /health` → `{ ok: true }`
- `GET /meta` → categories + payment methods
- `POST /auth/register` body `{ name, email, password }`
- `POST /auth/login` body `{ email, password }`
- `POST /auth/demo` empty body

Protected:

- `GET /auth/me`
- `PATCH /auth/me` body `{ name, email, password?, monthlyIncome?, savingsGoal? }`
- `POST /auth/onboarding` body `{ monthlyIncome, savingsGoal? }`
- `GET /dashboard` → user, records, play-money snapshot, monthly overview
- `GET /expenses?limit=200`
- `POST /expenses` body `{ text, amount, category, date, merchant?, paymentMethod?, note?, isCommitted?, upiRef? }`
  - `date` must be `YYYY-MM-DD`
- `PATCH /expenses/:id` same fields as create
- `DELETE /expenses/:id`
- `GET /recurring`
- `POST /recurring` body `{ text, amount, category?, dayOfMonth, merchant?, paymentMethod?, note?, isCommitted? }`
- `PATCH /recurring/:id` body `{ toggle: true }` or `{ isCommitted: true }` or `{ isActive: false }`
- `DELETE /recurring/:id`
- `GET /budgets`
- `POST /budgets` body `{ category, amount }` (upsert)
- `DELETE /budgets/:id`

Error shape is always `{ ok: false, error: "message" }`. Show `error` in the UI.

## Categories and payment methods

Categories: Food, Subscriptions, Shopping, Transportation, Bills, Entertainment, Healthcare, Education, Personal, Other

Payment methods: UPI, Paytm, PhonePe, GPay, Card, Cash, NetBanking, Other

Currency is INR. Format amounts as `₹1,299`.

## Product behavior to match the website

Nexpend is an India-first expense wallet.

- Locked vs play money: rent / SIP / EMI / recharge / Bills = locked (`isCommitted: true`). Food / OTT / shopping = play money.
- Dashboard `play` object has `weekSpendable`, `playLeftMonth`, `lockedMonthly`, `overPlay`, etc. Show “this week you can spend” as the hero number.
- Recurring bills auto-log when dashboard is fetched. Always load Home from `GET /dashboard`, not by inventing totals on the client.
- Dates are stored as UTC noon on the picked calendar day. Always send `YYYY-MM-DD`.

## App screens to build

1. Sign In / Sign Up / Demo button
2. Onboarding (income + optional savings goal)
3. Home dashboard from `GET /dashboard` (play money, month spend, recent expenses)
4. Add / edit expense
5. Expense list
6. Recurring bills
7. Category budgets
8. Profile (name, email, income, logout)

Keep UI simple, dark/light friendly, INR everywhere. Do not scrape SMS or connect a bank.

## Files to add (suggested)

- `lib/api.ts` — fetch wrapper that attaches the bearer token
- `lib/auth.ts` — login/register/me/logout + SecureStore
- `app` screens for the flows above

## Do not

- Do not put `DATABASE_URL` or `JWT_SECRET` in the mobile app
- Do not create a second database
- Do not use Clerk / Firebase Auth
- Do not hardcode a fake user
- Do not ignore `onboardingComplete`

Start by creating the API client, then auth screens, then dashboard + add expense. After login with the same email as the website, Home must show that user’s existing expenses.
