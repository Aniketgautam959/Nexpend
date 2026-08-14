# Nexpend

Nexpend is an India-first expense wallet. It is built around how people in India actually pay — UPI, Paytm, GPay, PhonePe — instead of bank logins or SMS scraping.

Most trackers show **income minus spend**. That leftover is misleading when rent, SIPs, and EMIs are already committed. Nexpend splits salary into **locked** money and **play money**, then shows the number that matters: **what you can actually spend this week**.

You do not type every rupee. Dump up to 10 payment screenshots. Nexpend reads amount, merchant, and UPI reference, skips failed payments, and skips duplicate UPI transactions.

---

## Why it is different

| Typical expense app | Nexpend |
| --- | --- |
| Bank / Account Aggregator login | No bank access — screenshot dump |
| Logs failed UPI screens as spends | Failed payments are rejected |
| “₹ left this month” | Weekly **play money** after locked bills + savings |
| One receipt at a time | Up to **10 screenshots** in one dump |
| Duplicate screenshots become double spends | Same UPI / UTR / amount+merchant+day is skipped |

---

## Features

- **Screenshot dump** — drop or upload up to 10 GPay / Paytm / PhonePe / invoice shots
- **Duplicate UPI skip** — matches UPI/UTR IDs when visible, otherwise amount + merchant + date
- **Failed payment filter** — “money not debited” screens are not saved as expenses
- **Locked vs play money** — rent, SIP, EMI, recharge stay locked; Swiggy / OTT / shopping is play
- **Weekly spendable** — remaining play money paced across days left in the month (IST)
- **Recurring bills** — Netflix, rent, SIPs auto-log on the chosen day of month
- **Category budgets**, monthly overview, charts, and INR-aware AI insights
- Email/password auth (JWT), onboarding (income + savings goal), light/dark theme
- Demo account for a quick walkthrough

---

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** + **Prisma**
- **JWT** (`jose`) + **bcryptjs**
- **OpenRouter** (vision + text) for screenshot OCR and insights
- **Chart.js**

---

## File structure

```
Nexpend/
├── app/
│   ├── actions/                 # Server actions (DB + AI)
│   │   ├── addExpenseRecord.ts
│   │   ├── dumpExpenses.ts      # Bulk save + duplicate check
│   │   ├── extractExpenseFromScreenshot.ts
│   │   ├── recurringExpenses.ts
│   │   ├── getAIInsights.ts
│   │   └── ...
│   ├── about/                   # Marketing / about page
│   ├── contact/
│   ├── onboarding/              # Income + savings goal
│   ├── profile/                 # Account + monthly plan
│   ├── sign-in/
│   ├── sign-up/
│   ├── layout.tsx
│   ├── page.tsx                 # Landing (guest) or dashboard
│   └── globals.css
├── components/
│   ├── ScreenshotDump.tsx       # Multi-image dump UI
│   ├── AddNewRecord.tsx         # Manual expense form
│   ├── BudgetStrip.tsx          # Locked vs play + this week
│   ├── RecurringExpenses.tsx
│   ├── AIInsights.tsx
│   ├── Guest.tsx                # Logged-out landing
│   └── ...
├── lib/
│   ├── ai.ts                    # OpenRouter vision + insights
│   ├── playMoney.ts             # IST week pacing, locked vs play
│   ├── upiDedupe.ts             # UPI fingerprint / merchant match
│   ├── dashboard.ts             # One-shot dashboard query
│   ├── auth.ts                  # JWT session
│   ├── db.ts                    # Prisma client
│   ├── expenseMeta.ts           # Categories, ₹ formatting
│   └── demoAccount.ts           # Demo login seed
├── prisma/
│   └── schema.prisma            # User, Record, Recurring, budgets
├── types/
│   └── Record.ts
├── middleware.ts                # Auth redirects
├── next.config.ts
└── package.json
```

### How the pieces connect

1. **`app/page.tsx`** loads the signed-in dashboard (or `Guest` if logged out).
2. **`lib/dashboard.ts`** fetches expenses + recurring items and computes play money.
3. **`lib/playMoney.ts`** treats active recurring marked **Locked** as committed, subtracts savings, then slices leftover play money across remaining days this week.
4. **`components/ScreenshotDump.tsx`** compresses images, calls vision extraction, then **`dumpExpenses.ts`** saves new rows and skips duplicates via **`lib/upiDedupe.ts`**.
5. **`lib/ai.ts`** talks to OpenRouter: vision for receipts, text for insights. Amounts stay in **INR (₹)**.

---

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or [Neon](https://neon.tech))
- An [OpenRouter](https://openrouter.ai) API key (for screenshot scan and AI insights)

### Setup

```bash
git clone https://github.com/Aniketgautam959/Nexpend.git
cd Nexpend
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
JWT_SECRET="use-a-long-random-string"
OPENROUTER_API_KEY="sk-or-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Push the Prisma schema, then start the app:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

### Demo login

Sign in with:

- **Email:** `demo@nexpend.app`
- **Password:** `password123`

The first demo login seeds a few sample expenses.

---

## Data model (short)

- **User** — email, password hash, monthly income, savings goal, onboarding flag
- **Record** — a spend (amount, category, merchant, payment method, locked flag, optional UPI ref + fingerprint)
- **RecurringExpense** — monthly auto-log; `isCommitted` marks locked bills vs play (OTT)
- **CategoryBudget** — per-category monthly cap

Play money formula:

```
play budget  = income − locked recurring − savings goal
play left    = play budget − non-locked spends this month
this week    = play left × (days left this week / days left this month)
```

Calendar math uses **Asia/Kolkata**. Expense dates are stored as UTC noon on the day you picked.

---

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Signs auth cookies |
| `OPENROUTER_API_KEY` | For AI | Screenshot vision + insights (`OPENAI_API_KEY` also works) |
| `NEXT_PUBLIC_APP_URL` | No | OpenRouter referer header (defaults to localhost) |

Never commit `.env` or `.env.local`.

---

## License

Private / personal project. See the repository owner for use.
