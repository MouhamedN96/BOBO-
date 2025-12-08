# NJOOBA Content Aggregation Strategy

## Overview
Automated content pipeline using 94 African data sources across AgriTech, FinTech, SaaS/Startups, and Ecosystem categories.

## Phase 1: Immediate Integration (Dec 15) - FREE Sources

### RSS Feed Sources (n8n Ready)
1. **TechCabal** ✅
   - URL: https://techcabal.com/rss
   - Category: News
   - Frequency: Daily
   - Status: Already in workflow

2. **Disrupt Africa**
   - URL: https://disrupt-africa.com/feed/
   - Category: Startup News
   - Frequency: Daily

3. **Benjamin Dada Newsletter**
   - URL: https://benjamindada.com/feed/
   - Category: Weekly Insights
   - Frequency: Weekly

4. **AGRA Reports**
   - URL: https://agra.org/feed/
   - Category: Agriculture Research
   - Frequency: Monthly

### API Sources (Free, No Auth)
1. **FAO WaPOR**
   - API: https://wapor.apps.fao.org/api
   - Data: Satellite imagery, crop health, water use
   - Use Case: Research posts, data visualizations

2. **CGIAR Open Data**
   - API: https://data.cgiar.org/api
   - Data: Crop yields, climate data, smallholder economics
   - Use Case: Research articles, tutorials

## Phase 2: API Integration (Jan) - API Key Required

1. **TradeMap (ITC)**
   - Freemium API
   - Data: Import/export flows for agricultural products
   - Cost: Free tier available

2. **Mono / Okra**
   - FinTech APIs
   - Data: Already integrated in SOLA
   - Use Case: FinTech news, tutorials

3. **VC4A**
   - Startup data partnership
   - Data: 10,000+ African startup profiles
   - Use Case: Job listings, funding news

## Phase 3: Partnership (Feb+) - Enterprise

1. **Esoko, Hello Tractor** - AgriTech real-time data
2. **Antler, Ventures Platform** - Accelerator portfolio data
3. **Briter Bridges** - Premium SaaS reports

---

## n8n Workflow Architecture

### Workflow 1: RSS News Aggregator (ACTIVE)
**Trigger:** Every 6 hours
**Sources:**
- TechCabal RSS
- Disrupt Africa RSS
- Benjamin Dada RSS

**Process:**
1. Fetch RSS feeds
2. Filter duplicates (check Supabase for existing titles)
3. Categorize by keywords
4. Extract relevant tags
5. Post to Supabase with bot user

**Categories Mapping:**
- Funding announcements → `startups`
- Product launches → `projects`
- Tech tutorials → `tutorials`
- Industry news → `news`
- Job postings → `jobs`

### Workflow 2: GitHub Trending African Devs
**Trigger:** Daily at 9 AM
**Source:** GitHub API
**Filter:** Developers with Africa in location OR repos tagged with African tech

### Workflow 3: Research Data Pipeline
**Trigger:** Weekly
**Sources:**
- FAO WaPOR API
- CGIAR Open Data API
- AGRA Reports RSS

**Output:** Deep-dive research posts with data visualizations

---

## Content Categorization Rules

```javascript
// In n8n Code node
const categorize = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();

  if (text.match(/funding|raised|investment|seed|series/)) {
    return 'startups';
  }
  if (text.match(/tutorial|how to|guide|learn/)) {
    return 'tutorials';
  }
  if (text.match(/job|hiring|position|career/)) {
    return 'jobs';
  }
  if (text.match(/event|conference|meetup|hackathon/)) {
    return 'events';
  }
  if (text.match(/open source|github|repository/)) {
    return 'projects';
  }

  return 'news';
}
```

---

## Quality Filters

**Minimum Requirements:**
- Title length: 10-200 characters
- Content length: 50+ characters
- No duplicate titles in last 30 days
- No blacklisted keywords (spam, crypto pumps, etc.)

**Auto-Feature Criteria:**
- Mentions African countries (5+ upvote weight)
- Contains "funding", "million", "raised" (auto-feature if > $1M)
- From verified sources (TechCabal, Disrupt Africa)

---

## Current Status

✅ **Live:**
- Bot user created (`njooba-bot`)
- Supabase integration working
- First post successfully created
- n8n instance accessible at https://n8n.njooba.com

🔄 **In Progress:**
- RSS aggregator workflow (created, needs activation)
- Webhook endpoint ready at `/api/webhooks/n8n`

📋 **Next Steps:**
1. Activate RSS workflow in n8n UI
2. Test end-to-end post creation
3. Add GitHub trending workflow
4. Set up error notifications (Slack/email)
5. Monitor feed quality and adjust filters

---

## Data Sources by Priority

### Immediate (Free RSS/API):
- TechCabal
- Disrupt Africa
- Benjamin Dada
- FAO WaPOR
- CGIAR Open Data
- AGRA Reports

### Q1 2025 (API Keys):
- TradeMap
- VC4A
- Mono/Okra

### Q2 2025 (Partnerships):
- Esoko
- Hello Tractor
- Briter Bridges
- AfriLabs
- Antler/Ventures Platform

---

## Success Metrics

**Week 1:**
- 50+ automated posts from RSS feeds
- 5+ research articles from APIs
- 90%+ categorization accuracy

**Month 1:**
- 500+ quality posts
- 10+ featured articles
- User engagement on automated content

**Quarter 1:**
- Full Phase 1 + Phase 2 sources integrated
- Custom workflows for each data source
- Real-time alerts for major funding news
