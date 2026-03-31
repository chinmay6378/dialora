<div align="center">

<img src="https://img.shields.io/badge/Dialora-AI%20Voice%20Agent-6366f1?style=for-the-badge&logo=phone&logoColor=white" alt="Dialora" />

# 🎙️ Dialora — AI Voice Calling Agent

### *Intelligent outbound calling, powered by AI. Scale your sales without scaling your team.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![n8n](https://img.shields.io/badge/n8n-Automation-EA4B71?style=flat-square&logo=n8n)](https://n8n.io)
[![Twilio](https://img.shields.io/badge/Twilio-Voice-F22F46?style=flat-square&logo=twilio)](https://twilio.com)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square&logo=groq)](https://groq.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=flat-square&logo=razorpay)](https://razorpay.com)

<br/>

> **Dialora** automates outbound sales calls using a human-like AI voice assistant.  
> Upload your leads, set up your knowledge base, launch a campaign — and let Sameera do the talking.

<br/>

![Dialora Dashboard Preview](https://dialora.lovable.app/)

</div>

---

## ✨ What is Dialora?

Dialora is a full-stack **AI voice calling platform** that lets businesses run outbound sales campaigns at scale. An AI agent named **Sameera** calls your leads, answers their questions from your company's knowledge base, identifies interest, and generates call summaries — all automatically.

No human agents needed. No missed calls. No manual follow-ups.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Voice Agent** | Human-like AI (Sameera) powered by Groq LLaMA makes real phone calls |
| 📚 **RAG Knowledge Base** | Upload your company document — AI answers questions from it using vector search |
| 📋 **Campaign Manager** | Create campaigns, upload leads via CSV, track progress in real time |
| 📞 **Twilio Integration** | Outbound calling via Twilio with speech recognition and TTS |
| 🧠 **Call Memory** | Maintains conversation context throughout each call via Postgres |
| 📊 **Call Results** | Auto-generated summaries, interest detection, and transcripts after every call |
| 💳 **Credit System** | 1 credit = 1 minute. Buy credits via Razorpay. 100 free credits on signup |
| ⚡ **Real-time Dashboard** | Live credit balance, campaign progress, and call stats via Supabase Realtime |
| 🔐 **Auth & Multi-tenancy** | Each user has their own leads, campaigns, knowledge base, and credits |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                   │
│  Dashboard · Campaigns · Leads · Knowledge Base · Billing        │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST + Realtime
┌────────────────────────▼────────────────────────────────────────┐
│                    Supabase (Backend)                            │
│  Auth · Postgres · Vector DB · Edge Functions · Realtime        │
└──────┬─────────────────┬──────────────────────┬────────────────┘
       │                 │                       │
┌──────▼──────┐  ┌───────▼───────┐  ┌──────────▼──────────┐
│     n8n     │  │   Razorpay    │  │       Twilio         │
│  Automation │  │   Payments    │  │   Voice Calling      │
│  Workflows  │  │               │  │   Speech-to-Text     │
└──────┬──────┘  └───────────────┘  └──────────┬──────────┘
       │                                        │
┌──────▼──────────────────────────────────────▼──────────┐
│                    Groq LLaMA 70B                        │
│         AI Agent · RAG · Call Summarization              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 How a Call Works

```
1. User creates campaign & uploads leads CSV
2. User uploads company knowledge document (PDF/TXT)
3. Campaign starts → n8n fetches pending leads
4. Twilio places outbound call to each lead
5. Lead picks up → Sameera greets them
6. Customer speaks → Twilio STT → n8n webhook
7. n8n fetches user context → Groq LLaMA generates response
8. AI searches knowledge base (RAG) for company info
9. Response spoken via Twilio Polly Neural TTS
10. Call ends → Summary generated → Credits deducted
11. Results appear live on dashboard
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** components
- **Supabase JS Client** for auth + data + realtime

### Backend
- **Supabase** — PostgreSQL, Auth, Vector DB (pgvector), Edge Functions, Realtime
- **n8n** (cloud) — workflow automation for all calling logic
- **Supabase Edge Functions** (Deno) — Razorpay payment processing

### AI & Voice
- **Groq** — LLaMA 3.3 70B for conversation, LLaMA 3.1 8B instant for speed
- **HuggingFace** — `sentence-transformers/all-MiniLM-L6-v2` for embeddings
- **Twilio** — outbound calls, Polly Kajal Neural TTS, speech recognition
- **pgvector** — vector similarity search for RAG

### Payments
- **Razorpay** — INR payments, order creation + signature verification

---

## 📁 Project Structure

```
dialora/
├── src/
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── Overview.tsx          # Stats + campaign progress
│   │   │   ├── Campaigns.tsx         # Campaign management
│   │   │   ├── Leads.tsx             # CSV upload + lead list
│   │   │   ├── KnowledgeBase.tsx     # Document upload for RAG
│   │   │   ├── CallResults.tsx       # Call summaries + transcripts
│   │   │   ├── Billing.tsx           # Credits + Razorpay payments
│   │   │   └── Settings.tsx          # Profile settings
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Index.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx               # Supabase auth context
│   │   └── useCredits.ts             # Real-time credit balance
│   └── integrations/
│       └── supabase/
│           ├── client.ts             # Supabase client
│           └── types.ts              # DB types
├── supabase/
│   ├── functions/
│   │   ├── razorpay-create-order/    # Edge function: create order
│   │   └── razorpay-verify-payment/ # Edge function: verify + add credits
│   └── migrations.sql               # All SQL functions + triggers
└── n8n/
    └── workflows/                    # Exported n8n workflow JSONs
```

---

## ⚙️ Setup Guide

### Prerequisites
- Node.js 18+
- Supabase account
- n8n cloud account
- Twilio account + phone number
- Groq API key
- HuggingFace API key
- Razorpay account (test or live)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/dialora.git
cd dialora
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

### 3. Supabase Setup

Run `supabase/migrations.sql` in the Supabase SQL Editor.

This creates:
- All database tables and relationships
- `handle_new_user` trigger → **100 free credits on signup**
- `deduct_call_credits` → auto-deducts after each call
- `add_credits` → called by Razorpay edge function
- RLS policies for all tables
- Vector search function for RAG

### 4. Deploy Edge Functions

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy razorpay-create-order
supabase functions deploy razorpay-verify-payment
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
supabase secrets set RAZORPAY_KEY_SECRET=your_secret
```

### 5. n8n Workflows

Import the following workflow JSONs into n8n:

| Workflow | Purpose |
|---|---|
| `main-workflow.json` | TwiML greeting, reply handling, AI agent, campaign loop |
| `twilio-status.json` | Post-call processing: summary, credits, transcript |

Set these credentials in n8n:
- **Groq API** — your Groq API key
- **Supabase API** — project URL + service role key
- **Postgres** — direct Supabase DB connection
- **HuggingFace** — API key
- **Twilio** — Account SID + Auth Token

### 6. Run Locally

```bash
npm run dev
```

---

## 💳 Credit System

| Event | Credits |
|---|---|
| New account signup | **+100 free** |
| Starter pack (₹499) | **+60** minutes |
| Growth pack (₹1,999) | **+300** minutes |
| Scale pack (₹3,999) | **+750** minutes |
| Per call | **−1 per minute** (rounded up) |

Credits never expire. Partial minutes are rounded up.

---

## 🧪 Testing Razorpay

Use these test credentials in Razorpay popup:

| Method | Details |
|---|---|
| Card | `4111 1111 1111 1111` · any future date · any CVV |
| UPI | `success@razorpay` |
| Net Banking | Select any bank → success |

---

## 📊 Database Schema

```
auth.users          ← Supabase Auth
    │
public.users        ← Profile (name, company)
    │
public.credits      ← Balance (1 row per user)
public.credit_transactions ← Full history
public.campaigns    ← Campaign metadata
public.leads        ← Lead list per campaign
public.call_sessions ← One per completed call
public.conversations ← Full transcript per session
public.documents    ← Knowledge base (chunked + embedded)
public.call_meta    ← CallSid → user_id mapping
public.n8n_chat_histories ← LLM memory per call
```

---

## 🔐 Security

- All secrets stored in Supabase Edge Function environment (never in frontend)
- Razorpay signature verified server-side using HMAC-SHA256
- Row Level Security (RLS) on all user data tables
- Service role key used only in n8n and Edge Functions
- Frontend uses anon key with RLS enforcement

---

## 🗺️ Roadmap

- [ ] WhatsApp follow-up after call
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Custom AI voice (ElevenLabs integration)
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Call scheduling with time zone support
- [ ] Analytics dashboard with conversion metrics
- [ ] Webhook notifications for interested leads
- [ ] Team/agency accounts with sub-users

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using React, Supabase, n8n, Twilio, and Groq

**[Live Demo](#) · [Documentation](#) · [Report Bug](#) · [Request Feature](#)**

</div>
