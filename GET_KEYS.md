# 🔑 Quick Guide to Get Your API Keys

## Step 1: Get Supabase Service Role Key

### Open this URL:
```
https://supabase.com/dashboard/project/lyhfeqejktubykgjzjtj/settings/api
```

### Instructions:
1. Scroll down to the section labeled **"Project API keys"**
2. You'll see multiple keys listed:
   - `anon` `public` ← Don't use this one
   - **`service_role`** `secret` ← **USE THIS ONE!**
3. Click the **eye icon** (👁️) next to `service_role` to reveal the key
4. Click the **copy icon** to copy it
5. The key starts with: `eyJhbGci...`

---

## Step 2: Get n8n API Key

### Open this URL:
```
https://n8n.njooba.com
```

### Instructions:
1. Click your **user avatar** (circle icon, top right corner)
2. Click **"Settings"**
3. Click **"API"** in the left sidebar
4. Click **"Create API Key"** button
5. Enter name: `claude-access`
6. Click **"Create"**
7. **IMMEDIATELY COPY THE KEY** (you'll only see it once!)
8. The key starts with: `n8n_api_...`

---

## Step 3: Paste the Keys

Once you have BOTH keys, paste them here in chat in this format:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...YOUR_FULL_KEY
N8N_API_KEY=n8n_api_...YOUR_FULL_KEY
```

Or add them to `.env.local` file:

```bash
# In: packages/webapp/.env.local

# Add these lines:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...YOUR_FULL_KEY
N8N_API_KEY=n8n_api_...YOUR_FULL_KEY
N8N_API_URL=https://n8n.njooba.com/api/v1
```

---

## ⚡ Why I Need These

- **Supabase Service Role Key**: Allows me to create workflows that insert posts directly into your database (bypassing RLS for automation)
- **n8n API Key**: Allows me to programmatically create, deploy, and manage workflows on your n8n instance

Once I have them, I can:
✅ Create RSS feed aggregator workflow
✅ Set up GitHub trending monitor
✅ Deploy Dev.to content sync
✅ Test everything end-to-end
✅ Push to GitHub

Ready when you are! 🚀
