# 🧠 BOBO Fused Reasoning Model - ProposalModelRs

**Project:** NJOOBA/BOBO - African E-Commerce AI Agent
**Version:** 1.0
**Status:** Proposal - Implementation Ready
**Last Updated:** 2025-12-28

**Single Source of Truth:** This document defines the architecture, implementation plan, and technical specifications for BOBO's on-device fused reasoning model.

---

## 📋 Executive Summary

**What:** An on-device AI agent combining routing, RAG, chain-of-thought reasoning, and tool use - fine-tuned specifically for Senegalese e-commerce.

**Why:** Enable 90% offline functionality for BOBO users with limited data/connectivity while providing intelligent, context-aware shopping assistance.

**How:** Fine-tune Qwen2.5-0.5B (270MB) with Unsloth on BOBO-specific tool use + reasoning patterns, deploy via MLC LLM for mobile inference.

**Impact:**
- 90% offline capability (only sync on WiFi)
- 0 data usage after initial model download
- Intelligent product search, recommendations, support
- Speaks French + Wolof
- Knows Senegalese products, brands, context

---

## 🎯 Core Capabilities

### **1. Routing (Intent Classification)**
```
User: "Je veux du thé"
↓
Router: SEARCH intent → search_products tool
```

### **2. Fetching (RAG - Retrieval Augmented Generation)**
```
Query: "attaya"
↓
Vector Search: [Thé Touba Attaya, Thé Lipton, Attaya Set...]
↓
Context: Top 5 relevant products fed to model
```

### **3. Interleaved Thinking (Chain-of-Thought + Actions)**
```
<think>User wants attaya. Need to search, check stock, show price</think>
<tool_call>search_products(query="attaya")</tool_call>
<tool_result>[Thé Touba 2500 CFA, in stock]</tool_result>
<think>Found product. User likely wants to buy</think>
Response: "Voici du thé Touba à 2500 CFA. En stock!"
```

### **4. Sequential Thinking (Step-by-Step Reasoning)**
```
Step 1: Understand intent (buying tea)
Step 2: Gather info (search products, check stock)
Step 3: Formulate answer (price, availability)
Step 4: Respond in French
```

### **5. Tool Use (BOBO-Specific Actions)**
```typescript
Tools:
- search_products(query, language)
- check_stock(productId)
- get_price(productId)
- add_to_cart(productId, quantity)
- calculate_total(cartItems)
- check_delivery_zones(location)
```

---

## 🏗️ Architecture

### **System Diagram**

```
┌─────────────────────────────────────────────┐
│          User Input (Voice/Text)            │
│         "Je veux acheter du riz"            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         BOBO Fused Reasoning Agent          │
│              (Qwen2.5-0.5B 270MB)           │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  1. ROUTER                           │  │
│  │  Classify: SEARCH/INFO/BUY/SUPPORT   │  │
│  └──────────────┬───────────────────────┘  │
│                 │                           │
│                 ▼                           │
│  ┌──────────────────────────────────────┐  │
│  │  2. FETCHER (RAG)                    │  │
│  │  Vector search local product DB      │  │
│  │  MiniLM-L6 embeddings (23MB)         │  │
│  └──────────────┬───────────────────────┘  │
│                 │                           │
│                 ▼                           │
│  ┌──────────────────────────────────────┐  │
│  │  3. THINKER (Reasoning)              │  │
│  │  <think> Chain-of-thought </think>   │  │
│  │  Interleaved with tool calls         │  │
│  └──────────────┬───────────────────────┘  │
│                 │                           │
│                 ▼                           │
│  ┌──────────────────────────────────────┐  │
│  │  4. EXECUTOR (Tools)                 │  │
│  │  search_products(), check_stock()    │  │
│  │  Local PowerSync DB + Queue          │  │
│  └──────────────┬───────────────────────┘  │
└─────────────────┼───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Response (French/Wolof)             │
│    "Le riz brisé coûte 25,000 CFA (50kg).   │
│         Il y en a 15 en stock."             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Technical Components

### **Component 1: Base Model**

**Model:** Qwen2.5-0.5B-Instruct
**Size:** 270MB (4-bit quantized)
**Speed:** 25-30 tokens/sec on mid-range Android
**Languages:** English, French ✅
**Context:** 32K tokens
**Tool Use:** Native support ✅

**Why Qwen2.5-0.5B?**
- Small enough for phones (270MB vs 1.8GB)
- Fast inference (25+ tokens/sec)
- Good multilingual (French works well)
- Native tool calling support
- Active community (Unsloth support)

---

### **Component 2: RAG System**

**Embedder:** all-MiniLM-L6-v2
**Size:** 23MB
**Embedding Dim:** 384
**Speed:** 50ms per query

**Vector Database:** SQLite with VSS extension

```sql
-- Product vectors table
CREATE VIRTUAL TABLE product_vectors USING vss0(
  embedding(384)  -- 384-dim embeddings
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT,
  name_fr TEXT,
  name_wo TEXT,
  description_fr TEXT,
  price INTEGER,
  stock INTEGER,
  category TEXT,
  brand TEXT
);

-- Search function
SELECT
  p.*,
  vss_distance(v.embedding, ?) as score
FROM products p
JOIN product_vectors v ON p.id = v.rowid
WHERE vss_search(v.embedding, ?)
ORDER BY score
LIMIT 5;
```

**Indexing Process:**
```typescript
// Generate embeddings for all products
const embedder = await AutoModel.from_pretrained('Xenova/all-MiniLM-L6-v2');

for (const product of products) {
  const text = `${product.name_fr} ${product.description_fr} ${product.category}`;
  const embedding = await embedder.embed(text);

  await db.run(
    'INSERT INTO product_vectors (rowid, embedding) VALUES (?, ?)',
    [product.id, embedding]
  );
}
```

---

### **Component 3: Tool Registry**

**BOBO-Specific Tools:**

```typescript
const BOBO_TOOLS = [
  {
    name: "search_products",
    description: "Search products in BOBO catalog by name, category, or description",
    parameters: {
      query: "string - Search query in French or Wolof",
      language: "string - 'fr' or 'wo'",
      category: "string - Optional filter (food, fashion, electronics, etc.)"
    },
    implementation: async ({ query, language, category }) => {
      const embedding = await embedder.embed(query);
      const results = await db.query(`
        SELECT * FROM products
        WHERE vss_search(embedding, ?)
        ${category ? 'AND category = ?' : ''}
        LIMIT 5
      `, [embedding, category]);
      return results;
    }
  },

  {
    name: "check_stock",
    description: "Check if product is in stock",
    parameters: {
      productId: "string - Product ID"
    },
    implementation: async ({ productId }) => {
      const result = await db.query(
        'SELECT stock FROM products WHERE id = ?',
        [productId]
      );
      return { inStock: result.stock > 0, quantity: result.stock };
    }
  },

  {
    name: "get_price",
    description: "Get product price in CFA",
    parameters: {
      productId: "string - Product ID"
    },
    implementation: async ({ productId }) => {
      const result = await db.query(
        'SELECT price, currency FROM products WHERE id = ?',
        [productId]
      );
      return { price: result.price, currency: 'XOF' };
    }
  },

  {
    name: "add_to_cart",
    description: "Add product to shopping cart (queued if offline)",
    parameters: {
      productId: "string - Product ID",
      quantity: "number - Quantity to add"
    },
    implementation: async ({ productId, quantity }) => {
      await offlineQueue.add({
        action: 'add_to_cart',
        productId,
        quantity,
        timestamp: Date.now()
      });
      return { success: true, queued: !isOnline() };
    }
  },

  {
    name: "calculate_total",
    description: "Calculate total cart value",
    parameters: {
      cartItems: "array - Cart items with productId and quantity"
    },
    implementation: async ({ cartItems }) => {
      let total = 0;
      for (const item of cartItems) {
        const product = await db.query(
          'SELECT price FROM products WHERE id = ?',
          [item.productId]
        );
        total += product.price * item.quantity;
      }
      return { total, currency: 'XOF' };
    }
  },

  {
    name: "check_delivery_zones",
    description: "Check if delivery available in user's area",
    parameters: {
      location: "string - City or neighborhood in Dakar"
    },
    implementation: async ({ location }) => {
      const zones = ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiaroye'];
      const available = zones.some(zone =>
        location.toLowerCase().includes(zone.toLowerCase())
      );
      return {
        available,
        deliveryTime: available ? '24-48h' : '3-5 jours',
        fee: available ? 1000 : 2500
      };
    }
  }
];
```

---

### **Component 4: Fine-Tuning Dataset**

**Dataset Structure:**

```jsonl
{
  "messages": [
    {
      "role": "system",
      "content": "Tu es Bo, l'assistant IA de BOBO. Tu aides les clients sénégalais à faire leurs achats. Tu parles français et wolof. Tu utilises des outils pour chercher des produits, vérifier les stocks et les prix."
    },
    {
      "role": "user",
      "content": "Je cherche du thé attaya"
    },
    {
      "role": "assistant",
      "content": "<think>L'utilisateur cherche du thé attaya. C'est un produit populaire au Sénégal. Je dois d'abord chercher dans le catalogue.</think>\n\n<tool_call>\n{\n  \"name\": \"search_products\",\n  \"arguments\": {\"query\": \"attaya\", \"language\": \"fr\", \"category\": \"food\"}\n}\n</tool_call>"
    },
    {
      "role": "tool",
      "content": "[{\"id\":\"prod_123\",\"name\":\"Thé Touba Attaya 500g\",\"price\":2500,\"stock\":15,\"brand\":\"Touba\"}]"
    },
    {
      "role": "assistant",
      "content": "<think>J'ai trouvé du thé Touba Attaya. C'est une marque locale populaire. Il est en stock (15 unités). Prix raisonnable à 2500 CFA. Je vais présenter cette option à l'utilisateur.</think>\n\nJ'ai trouvé du **Thé Touba Attaya 500g** à **2,500 CFA**. C'est une bonne marque sénégalaise. Il y en a 15 en stock. Vous voulez en commander combien?"
    }
  ]
}

{
  "messages": [
    {
      "role": "system",
      "content": "Tu es Bo, l'assistant IA de BOBO..."
    },
    {
      "role": "user",
      "content": "Dafa am ci stock?"
    },
    {
      "role": "assistant",
      "content": "<think>L'utilisateur demande en wolof si c'est en stock. Il fait probablement référence au dernier produit discuté. Je dois vérifier le stock.</think>\n\n<tool_call>\n{\n  \"name\": \"check_stock\",\n  \"arguments\": {\"productId\": \"prod_123\"}\n}\n</tool_call>"
    },
    {
      "role": "tool",
      "content": "{\"inStock\":true,\"quantity\":15}"
    },
    {
      "role": "assistant",
      "content": "<think>Le stock est bon (15 unités). L'utilisateur a parlé en wolof, je devrais répondre en wolof aussi pour être amical.</think>\n\nWaaw, dafa am! Il y en a 15 en stock. 😊"
    }
  ]
}
```

**Dataset Requirements:**
- **500-1000 examples** covering:
  - Product search (200 examples)
  - Stock/price queries (150 examples)
  - Cart operations (100 examples)
  - Delivery questions (50 examples)
  - Wolof code-switching (100 examples)
  - Edge cases (100 examples)

**Senegalese Context:**
- Local products: attaya, bissap, thieboudienne, boubou, etc.
- Local brands: Touba, Kirene, Gazelle, etc.
- Wolof phrases: "dafa am?" (is it available?), "ñaata la?" (how much?)
- French-Wolof code-switching (common in Dakar)
- CFA currency (XOF)
- Dakar neighborhoods: Plateau, Medina, Pikine, etc.

---

## 🎓 Fine-Tuning Process

### **Setup (Unsloth on Google Colab)**

```python
# Install Unsloth
!pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"

from unsloth import FastLanguageModel
import torch

# Load base model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="Qwen/Qwen2.5-0.5B-Instruct",
    max_seq_length=2048,
    dtype=None,  # Auto-detect
    load_in_4bit=True  # Efficient memory usage
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16,  # LoRA rank
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42
)

# Load BOBO dataset
from datasets import load_dataset

dataset = load_dataset('json', data_files='bobo_tool_use_dataset.jsonl')

# Format for training
def format_prompt(example):
    return tokenizer.apply_chat_template(
        example['messages'],
        tokenize=False,
        add_generation_prompt=False
    )

dataset = dataset.map(lambda x: {'text': format_prompt(x)})

# Train with SFT (Supervised Fine-Tuning)
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset['train'],
    dataset_text_field='text',
    max_seq_length=2048,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=10,
        num_train_epochs=3,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",
        seed=42,
        output_dir="outputs/bobo-agent-v1"
    )
)

# Train (2-4 hours on free Colab T4 GPU)
trainer.train()

# Save model
model.save_pretrained("bobo-agent-v1")
tokenizer.save_pretrained("bobo-agent-v1")

# Export for mobile (GGUF format for MLC LLM)
model.save_pretrained_merged(
    "bobo-agent-v1-q4",
    tokenizer,
    save_method="merged_4bit"
)
```

**Training Time:** 2-4 hours on free Colab
**Cost:** $0 (free Colab GPU)
**Output:** 270MB quantized model ready for mobile

---

## 📱 Mobile Integration (React Native)

### **Setup MLC LLM**

```bash
# Install MLC LLM for React Native
npm install @mlc-ai/web-llm
```

### **Initialize Agent**

```typescript
// bobo-app/src/lib/ai/BOBOAgent.ts
import * as webllm from "@mlc-ai/web-llm";
import { AutoModel } from '@huggingface/transformers';
import { db } from '../database';
import { BOBO_TOOLS } from './tools';

export class BOBOAgent {
  private model: webllm.MLCEngine;
  private embedder: any;
  private tools: typeof BOBO_TOOLS;
  private conversationHistory: any[] = [];

  async initialize() {
    console.log('Loading BOBO Agent...');

    // Load fine-tuned model
    this.model = await webllm.CreateMLCEngine(
      "bobo-agent-v1-q4",  // Your custom model
      {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 512
      }
    );

    // Load embedder for RAG
    this.embedder = await AutoModel.from_pretrained(
      'Xenova/all-MiniLM-L6-v2'
    );

    // Register tools
    this.tools = BOBO_TOOLS;

    console.log('BOBO Agent ready!');
  }

  async chat(userMessage: string) {
    // 1. Fetch relevant context (RAG)
    const context = await this.fetchContext(userMessage);

    // 2. Add system prompt + context
    const systemPrompt = `Tu es Bo, l'assistant IA de BOBO.

Contexte produits pertinents:
${context.map(p => `- ${p.name_fr}: ${p.price} CFA (stock: ${p.stock})`).join('\n')}

Utilise les outils disponibles pour aider l'utilisateur.`;

    // 3. Add message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // 4. Generate response
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory
    ];

    const response = await this.model.chat.completions.create({
      messages,
      stream: false
    });

    const assistantMessage = response.choices[0].message.content;

    // 5. Parse tool calls
    const toolCalls = this.extractToolCalls(assistantMessage);

    if (toolCalls.length > 0) {
      // Execute tools
      for (const call of toolCalls) {
        const result = await this.executeTool(call.name, call.arguments);

        // Add tool result to history
        this.conversationHistory.push({
          role: 'tool',
          content: JSON.stringify(result)
        });
      }

      // Re-generate with tool results
      return this.chat(''); // Continue conversation
    }

    // 6. Add response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    // 7. Clean <think> tags for user display
    const cleanResponse = assistantMessage.replace(/<think>.*?<\/think>/gs, '').trim();

    return cleanResponse;
  }

  async fetchContext(query: string) {
    // Generate query embedding
    const queryEmbedding = await this.embedder.embed(query);

    // Vector search
    const results = await db.query(`
      SELECT p.*
      FROM products p
      JOIN product_vectors v ON p.id = v.rowid
      WHERE vss_search(v.embedding, ?)
      ORDER BY vss_distance(v.embedding, ?)
      LIMIT 5
    `, [queryEmbedding, queryEmbedding]);

    return results;
  }

  extractToolCalls(message: string) {
    const toolCallRegex = /<tool_call>\s*({.*?})\s*<\/tool_call>/gs;
    const calls = [];

    let match;
    while ((match = toolCallRegex.exec(message)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        calls.push(parsed);
      } catch (e) {
        console.error('Failed to parse tool call:', e);
      }
    }

    return calls;
  }

  async executeTool(name: string, args: any) {
    const tool = this.tools.find(t => t.name === name);
    if (!tool) {
      return { error: `Tool ${name} not found` };
    }

    try {
      return await tool.implementation(args);
    } catch (e) {
      return { error: e.message };
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Singleton instance
export const boboAgent = new BOBOAgent();
```

### **Usage in App**

```typescript
// bobo-app/src/screens/ChatScreen.tsx
import { boboAgent } from '../lib/ai/BOBOAgent';

export function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize agent on mount
    boboAgent.initialize();
  }, []);

  async function sendMessage(text: string) {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const response = await boboAgent.chat(text);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <ScrollView>
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}
      </ScrollView>

      <TextInput
        onSubmitEditing={e => sendMessage(e.nativeEvent.text)}
        placeholder="Demandez à Bo..."
      />
    </View>
  );
}
```

---

## 📊 Performance Metrics

### **Model Performance**

| Metric | Target | Expected |
|--------|--------|----------|
| **Inference Speed** | >15 tokens/sec | 25-30 tokens/sec |
| **Memory Usage** | <1GB RAM | 700MB |
| **Cold Start** | <3s | 1.5s |
| **Tool Call Accuracy** | >85% | 90% |
| **French Quality** | >80% vs GPT-4 | 85% |
| **Wolof Understanding** | >70% | 75% |

### **User Experience**

| Metric | Target | Method |
|--------|--------|--------|
| **Offline Capability** | 90% | Track online vs offline queries |
| **Data Savings** | 95% | vs cloud API baseline |
| **Response Time** | <2s | Avg latency for simple queries |
| **User Satisfaction** | >4.0/5 | In-app rating |

### **Business Impact**

| Metric | Baseline | With Agent |
|--------|----------|------------|
| **Search Success Rate** | 60% | 85% |
| **Cart Conversion** | 15% | 30% |
| **Support Queries** | 100/day | 20/day |
| **Data Cost/User** | 50MB/month | 5MB/month |

---

## 🗓️ Implementation Timeline

### **Week 1-2: Dataset Creation**
- [ ] Define 50 common user intents
- [ ] Write 500 example dialogues (French)
- [ ] Add 100 Wolof code-switching examples
- [ ] Review and validate dataset
- [ ] Format for Unsloth training

### **Week 3: Model Fine-Tuning**
- [ ] Set up Google Colab
- [ ] Configure Unsloth training
- [ ] Fine-tune Qwen2.5-0.5B (4 hours)
- [ ] Evaluate on validation set
- [ ] Export for mobile (GGUF format)

### **Week 4: RAG System**
- [ ] Generate embeddings for products
- [ ] Set up SQLite VSS extension
- [ ] Index product catalog
- [ ] Test vector search accuracy
- [ ] Optimize for mobile

### **Week 5-6: Mobile Integration**
- [ ] Install MLC LLM in React Native
- [ ] Load model on device
- [ ] Implement BOBOAgent class
- [ ] Integrate with chat UI
- [ ] Add tool registry
- [ ] Test offline functionality

### **Week 7: Tool Implementation**
- [ ] Implement all 6 tools
- [ ] Connect to PowerSync DB
- [ ] Add offline queue
- [ ] Test tool calling accuracy
- [ ] Handle edge cases

### **Week 8: Testing & Optimization**
- [ ] Beta test with 10 Senegalese users
- [ ] Measure performance metrics
- [ ] Optimize latency
- [ ] Fix bugs
- [ ] Improve accuracy

---

## 🚨 Critical Success Factors

### **1. Dataset Quality (Most Important!)**
- Must include real Senegalese products
- Natural French-Wolof code-switching
- Realistic user queries
- Correct tool usage patterns

**How to ensure:**
- Interview 20 Senegalese shoppers (what do they ask?)
- Analyze WhatsApp market conversations
- Include local slang, brands, products
- Have native speaker review all examples

### **2. Model Selection**
- Qwen2.5-0.5B is the sweet spot (270MB)
- Alternatives: Llama 3.2 1B (600MB), Phi-2 (800MB)
- Must support French well
- Must fit in <500MB

### **3. Offline Performance**
- RAG must be fast (<100ms)
- Tool calls must work offline (PowerSync)
- Model inference <2s
- No blocking UI

### **4. User Experience**
- Transparent about offline/online status
- Graceful degradation (queue when offline)
- French + Wolof feel natural
- Fast enough to feel instant

---

## 🎯 Success Criteria

### **Technical Metrics**
- ✅ Model loads in <3 seconds
- ✅ Inference speed >20 tokens/sec
- ✅ Tool call accuracy >85%
- ✅ RAG retrieval precision >80%
- ✅ 90% functionality offline

### **User Metrics**
- ✅ 80% of users prefer agent vs manual search
- ✅ Average session time increases by 2x
- ✅ Cart conversion rate increases by 50%
- ✅ Support queries decrease by 80%

### **Business Metrics**
- ✅ Data usage decreases by 95%
- ✅ User retention increases by 30%
- ✅ Revenue per user increases by 40%

---

## 💰 Cost Analysis

### **Development Costs**
| Item | Cost |
|------|------|
| Dataset creation (2 weeks) | $0 (DIY) |
| Google Colab GPU (fine-tuning) | $0 (free tier) |
| Testing devices | $200 (2 mid-range phones) |
| User research (interviews) | $100 (incentives) |
| **Total** | **$300** |

### **Operational Costs**
| Item | Monthly Cost |
|------|--------------|
| Cloud API (backup) | $10 |
| Model hosting | $0 (on-device) |
| Vector DB hosting | $0 (SQLite local) |
| **Total** | **$10/month** |

### **Savings vs Cloud API**
| Metric | Cloud API | On-Device | Savings |
|--------|-----------|-----------|---------|
| Cost per 1000 queries | $2.00 | $0.00 | 100% |
| Data usage per query | 50KB | 0KB | 100% |
| Latency | 500ms | 100ms | 80% |

**For 10,000 users with 10 queries/day:**
- Cloud API cost: $6,000/month
- On-device cost: $10/month (backup only)
- **Savings: $5,990/month**

---

## 🔒 Security & Privacy

### **Data Privacy**
- ✅ All inference on-device (data never leaves phone)
- ✅ No API calls (except sync)
- ✅ User conversations not logged
- ✅ GDPR compliant (local processing)

### **Model Security**
- ✅ Model is read-only (can't be tampered)
- ✅ Tool execution sandboxed
- ✅ No code execution (only predefined tools)
- ✅ Rate limiting on expensive operations

### **African Context**
- ✅ Works without internet (trust without connectivity)
- ✅ No data selling (common fear in Africa)
- ✅ Transparent about what data is used
- ✅ Local processing = local trust

---

## 🌍 African-Specific Considerations

### **1. Device Constraints**
- Target: 2-4GB RAM phones (mid-range)
- Model must be <300MB
- Inference must work on Mali GPU (common)
- Battery efficient (users charge once/day)

### **2. Network Reality**
- Assume 2G/3G most of the time
- WiFi only for initial model download
- Offline-first for all features
- Sync when on WiFi

### **3. Cultural Context**
- French-Wolof code-switching is normal
- Local products matter (attaya, thiebou, boubou)
- Local brands matter (Touba, Kirene, Gazelle)
- Trust is earned through reliability

### **4. Economic Reality**
- Data costs money (500MB = 1-2 days salary)
- Phone storage is limited (8-32GB)
- Users won't update app frequently
- Price matters more than features

---

## 📚 References & Resources

### **Model & Tools**
- [Qwen2.5 Models](https://huggingface.co/Qwen)
- [Unsloth Fine-Tuning](https://github.com/unslothai/unsloth)
- [MLC LLM](https://github.com/mlc-ai/mlc-llm)
- [all-MiniLM-L6-v2 Embedder](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [SQLite VSS Extension](https://github.com/asg017/sqlite-vss)

### **Inspiration**
- [DeepSeek R1](https://github.com/deepseek-ai/DeepSeek-R1) - Reasoning + tool use
- [SmolVLM](https://huggingface.co/HuggingFaceTB/SmolVLM-Instruct) - Tiny vision model
- [Llama 3.2](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/) - Edge deployment

### **BOBO Context**
- `NJOOBA_MASTER_CONTEXT.md` - The Architect identity
- `SECURITY_RULES.md` - Security requirements
- `ELEPHANTS.md` - Production blockers
- `USER_TASKS.md` - Deployment checklist

---

## 🚀 Next Steps

### **Immediate (This Week)**
1. Start dataset creation (50 examples)
2. Set up Unsloth on Colab
3. Test base Qwen2.5-0.5B performance

### **Short-term (This Month)**
1. Complete 500-example dataset
2. Fine-tune first version
3. Test in React Native
4. Measure baseline metrics

### **Long-term (Next 3 Months)**
1. Deploy to beta users
2. Iterate based on feedback
3. Expand to 1000 examples
4. Add Wolof fine-tuning

---

## ✅ Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-28 | Use Qwen2.5-0.5B over Llama 3.2 1B | 270MB vs 600MB, similar quality |
| 2025-12-28 | Fine-tune with Unsloth | 5x faster than standard, free Colab |
| 2025-12-28 | SQLite VSS for vector DB | Lightweight, no server needed |
| 2025-12-28 | 500 examples minimum | Balance quality vs effort |
| 2025-12-28 | 6 core tools initially | Start small, expand later |

---

## 📞 Contact & Support

**For questions about this proposal:**
- Technical: Review NJOOBA_MASTER_CONTEXT.md
- Architecture: Review SESSION_HANDOFF.md
- Implementation: Follow this document step-by-step

**For updates:**
- This is the single source of truth
- Update version number when making changes
- Document all decisions in Decision Log

---

**Version:** 1.0
**Status:** ✅ Ready for Implementation
**Next Review:** After dataset creation complete

---

*"The best AI for Africa is the one that works offline."*
— The Architect
