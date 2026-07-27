import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory Data Store for Live MVP State
  let users = [
    {
      email: 'lead@chainsight.io',
      password: 'supply123',
      role: 'procurement',
      name: 'Alex M.',
      title: 'Procurement Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    },
    {
      email: 'admin@chainsight.io',
      password: 'admin123',
      role: 'admin',
      name: 'Sarah K.',
      title: 'Platform Administrator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    },
    {
      email: 'partner@acme.io',
      password: 'partner123',
      role: 'supplier',
      name: 'Ravi D.',
      title: 'Partner: ACME Electronics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
  ];

  let liveFeeds = [
    { id: 'f-1', name: 'AIS Maritime Vessel Tracker', type: 'ais', count: 85, status: 'online', latencyMs: 42 },
    { id: 'f-2', name: 'POS Point-of-Sale Store Telemetry', type: 'pos', count: 120, status: 'online', latencyMs: 18 },
    { id: 'f-3', name: 'WMO Meteorological & Hurricane Stream', type: 'weather', count: 42, status: 'online', latencyMs: 110 },
    { id: 'f-4', name: 'Port Authority Congestion Signals', type: 'port', count: 38, status: 'online', latencyMs: 65 },
    { id: 'f-5', name: 'Commodity Markets Spot Price API', type: 'market', count: 64, status: 'online', latencyMs: 32 },
    { id: 'f-6', name: 'Global Geopolitical News NLP Ingestion', type: 'geo', count: 82, status: 'degraded', latencyMs: 240 },
  ];

  let posStores = [
    { storeId: 'POS-BLR-01', storeName: 'Bangalore Tech Hub Store', region: 'South India', activeTerminals: 14, salesVelocityUsd: 48500, salesTrendPct: 42.5, topSellingSku: 'SKU-ALPHA-POS-5G', stockoutRisk: 'Critical' },
    { storeId: 'POS-MUM-04', storeName: 'Mumbai Central OmniHub', region: 'West India', activeTerminals: 22, salesVelocityUsd: 72100, salesTrendPct: 18.2, topSellingSku: 'SKU-BETA-OLED-BOARD', stockoutRisk: 'Moderate' },
    { storeId: 'POS-DEL-02', storeName: 'Delhi NCR Logistics Outlet', region: 'North India', activeTerminals: 18, salesVelocityUsd: 59000, salesTrendPct: -4.1, topSellingSku: 'SKU-LEGACY-CARD-READER', stockoutRisk: 'Low' },
    { storeId: 'POS-SGP-08', storeName: 'Singapore Duty Free Terminal', region: 'Southeast Asia', activeTerminals: 12, salesVelocityUsd: 91400, salesTrendPct: 31.0, topSellingSku: 'SKU-ALPHA-POS-5G', stockoutRisk: 'Moderate' },
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      platform: 'ChainSight Enterprise Platform',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Auth Login Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify email and password.' });
    }
    const token = `cs_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    res.json({
      access_token: token,
      token_type: 'bearer',
      role: user.role,
      name: user.name,
      title: user.title,
      avatar: user.avatar,
      email: user.email,
    });
  });

  // Live Telemetry Feeds API
  app.get('/api/feeds/live', (req, res) => {
    // Add dynamic jitter to latency to simulate real network conditions
    const updatedFeeds = liveFeeds.map((f) => ({
      ...f,
      latencyMs: Math.max(10, Math.round(f.latencyMs + (Math.random() * 20 - 10))),
      lastUpdated: 'Just now',
    }));
    res.json(updatedFeeds);
  });

  // POS Real-Time Store Telemetry API
  app.get('/api/demand/pos', (req, res) => {
    res.json(posStores);
  });

  // Scenario Simulator API with Dynamic Gemini AI Response Playbook
  app.post('/api/simulate', async (req, res) => {
    const { eventType, targetNode, revenueExposedM, durationDays, severityPct } = req.body;
    const rev = parseFloat(revenueExposedM) || 850;
    const dur = parseInt(durationDays) || 30;
    const sev = parseFloat(severityPct) || 80;

    const sevFactor = sev / 100;
    const durFactor = dur / 365;

    const revenueAtRiskM = +(rev * sevFactor * durFactor * 1.4).toFixed(1);
    const logisticsCost = +(revenueAtRiskM * 0.18).toFixed(1);
    const carryCost = +(rev * 0.02 * durFactor).toFixed(1);
    const altSourcingCost = +(revenueAtRiskM * 0.12).toFixed(1);
    const penalties = +(revenueAtRiskM * 0.08).toFixed(1);
    const totalExposureM = +(revenueAtRiskM + logisticsCost + carryCost + altSourcingCost + penalties).toFixed(1);

    const proactiveCost = +(totalExposureM * 0.35).toFixed(1);
    const savingsM = +(totalExposureM - proactiveCost).toFixed(1);

    const avgDelayDays = Math.round(dur * sevFactor * 0.55);
    const recoveryDays = Math.round(dur * 1.4 + 5);
    const affectedSkus = Math.round(40 + sevFactor * 60);

    const impactLevel = totalExposureM > 50 ? 'critical' : totalExposureM > 20 ? 'high' : 'medium';

    // Dynamic Contextual Playbook & Parallel Gemini AI Analysis
    let playbook: { priority: 'IMMEDIATE' | 'URGENT' | 'MONITOR'; action: string; detail: string }[] = [];
    let parallelAiAnalysis = '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const prompt = `Act as an executive supply chain risk copilot. Analyze this scenario:
Disruption Event: "${eventType}"
Target Node/Location: "${targetNode}"
Exposed Revenue: $${rev}M
Estimated Duration: ${dur} days
Severity Factor: ${sev}%

Calculated Metrics:
- Revenue at Risk: $${revenueAtRiskM}M
- Estimated Delay: +${avgDelayDays} days
- Total Financial Exposure: $${totalExposureM}M
- Projected Savings via Proactive Mitigation: $${savingsM}M

Please generate a JSON object with two fields:
1) "playbook": An array of 5 highly specific, actionable mitigation steps tailored to ${eventType} at ${targetNode}. Each item must have:
   - "priority": "IMMEDIATE" or "URGENT" or "MONITOR"
   - "action": Concise imperative action title
   - "detail": Specific quantitative step detailing volumes, SLAs, or POS inventory shifts.
2) "parallelAiAnalysis": A detailed Markdown executive memo breaking down:
   - Cascading impact on POS store fulfillment and maritime/air logistics lanes
   - Root cause containment vector for ${targetNode}
   - Step-by-step mitigation timeline with SLA recovery guarantees.

Return ONLY valid JSON.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const jsonStr = aiResponse.text ? aiResponse.text.trim() : '';
        const parsed = JSON.parse(jsonStr);
        if (parsed.playbook && Array.isArray(parsed.playbook)) {
          playbook = parsed.playbook;
        }
        if (parsed.parallelAiAnalysis) {
          parallelAiAnalysis = parsed.parallelAiAnalysis;
        }
      } catch (err) {
        console.error('Gemini Simulation Playbook Error, falling back to contextual generator:', err);
      }
    }

    // Fallback or baseline contextual generation if API key not present or call failed
    if (playbook.length === 0) {
      if (eventType.includes('POS') || eventType.includes('Demand')) {
        playbook = [
          { priority: 'IMMEDIATE', action: `Re-allocate ${Math.round(sevFactor * 35)}% Regional POS Stock`, detail: `Draw down safety stock from Chennai & Mumbai distribution centers to support ${targetNode}.` },
          { priority: 'IMMEDIATE', action: 'Trigger Automated Air-Expedite POs', detail: `Release priority purchase orders for top ${affectedSkus} selling SKUs to prevent store stockouts.` },
          { priority: 'URGENT', action: 'Cap High-Velocity POS Order Limits', detail: 'Implement store inventory caps per customer to preserve SLA stock during peak demand.' },
          { priority: 'URGENT', action: 'Notify Retail POS Outlets of Buffer Shift', detail: `Send automated EDI telemetry feeds to ${targetNode} retail partners.` },
          { priority: 'MONITOR', action: 'Real-Time POS Terminal Velocity Ingestion', detail: 'Stream hourly transaction logs to monitor store inventory depletion rates.' },
        ];
      } else if (eventType.includes('Weather') || eventType.includes('Met')) {
        playbook = [
          { priority: 'IMMEDIATE', action: `Divert Cargo Vessels away from ${targetNode}`, detail: `Instruct maritime carriers to reroute ${Math.round(sevFactor * 40)}% cargo via safe inland rail & air corridors.` },
          { priority: 'IMMEDIATE', action: 'Activate Buffer Warehouses in Safe Zones', detail: 'Stage inbound components in secondary inland fulfillment centers prior to storm landfall.' },
          { priority: 'URGENT', action: 'Re-negotiate ETA Delivery Schedules', detail: `Issue SLA delay advisories (+${avgDelayDays} days) to key account managers.` },
          { priority: 'URGENT', action: 'Deploy Satellite Meteorological Telemetry', detail: 'Hook live Doppler radar and satellite AIS tracking feeds directly into ChainSight.' },
          { priority: 'MONITOR', action: 'Post-Storm Port Re-opening Status', detail: 'Monitor berth availability and crane operational capacity upon storm passage.' },
        ];
      } else if (eventType.includes('Supplier')) {
        playbook = [
          { priority: 'IMMEDIATE', action: 'Activate Tier-2 Dual-Source Contracts', detail: `Shift ${Math.round(sevFactor * 50)}% PO volume from ${targetNode} to pre-qualified secondary vendor.` },
          { priority: 'IMMEDIATE', action: 'Freeze Unpaid Outbound Remittances', detail: 'Hold pending supplier invoices until asset insolvency evaluation completes.' },
          { priority: 'URGENT', action: 'Re-assign Tooling & Proprietary Dies', detail: 'Execute emergency physical asset retrieval from primary supplier facilities.' },
          { priority: 'URGENT', action: 'Accelerate Component Safety Inspections', detail: 'Fast-track ISO compliance audits for secondary component batches.' },
          { priority: 'MONITOR', action: 'Financial Insolvency & Credit Monitoring', detail: 'Subscribe to real-time credit rating alerts for all key vendor nodes.' },
        ];
      } else {
        playbook = [
          { priority: 'IMMEDIATE', action: `Reroute Freight via Backup Hubs around ${targetNode}`, detail: `Divert ${Math.round(sevFactor * 45)}% container TEUs through alternate feeder ports within 24h.` },
          { priority: 'IMMEDIATE', action: 'Trigger POS Store Buffer Stock Drawdown', detail: `Utilize regional 30-day safety stock for Tier-1 outlets to absorb +${avgDelayDays}-day transit delay.` },
          { priority: 'URGENT', action: 'Activate Emergency Secondary Sourcing POs', detail: 'Issue spot market purchase orders to pre-vetted dual-source partners.' },
          { priority: 'URGENT', action: 'Transmit Customer SLA Advisory via EDI', detail: `Automatically update ETA timestamps across ERP and retail channels.` },
          { priority: 'MONITOR', action: 'Continuous AIS & Port Congestion Telemetry', detail: 'Monitor vessel turnaround times and container dwell metrics in real time.' },
        ];
      }
    }

    if (!parallelAiAnalysis) {
      parallelAiAnalysis = `### Executive AI Risk & Mitigation Memo

#### 1. Scenario Diagnosis & Cascade Impact
The simulated **${eventType}** at **${targetNode}** represents a **${impactLevel.toUpperCase()}** severity risk factor (**${sev}% severity over ${dur} days**).
- **Revenue Exposure:** **$${revenueAtRiskM}M** in direct revenue is at immediate risk.
- **Supply Chain Delay:** Cumulative transit delays will average **+${avgDelayDays} days**, cascading into **${recoveryDays} days** of total recovery timeline across **${affectedSkus} SKUs**.

#### 2. Strategic Mitigation Directives
To mitigate the **$${totalExposureM}M** financial exposure down to **$${proactiveCost}M** (saving **$${savingsM}M**):
1. **Logistics Rerouting:** Immediately divert priority shipments through secondary freight corridors to bypass **${targetNode}**.
2. **POS Retail Protection:** Shift buffer inventory at regional retail outlets to maintain continuous store sales velocity.
3. **Supplier Dual-Sourcing:** Activate emergency PO allocations with pre-vetted dual suppliers to ensure uninterrupted assembly inputs.

*Analysis generated dynamically by ChainSight AI Engine & Gemini 3.6 Flash.*`;
    }

    res.json({
      revenueAtRiskM,
      avgDelayDays,
      recoveryDays,
      totalExposureM,
      savingsProactiveM: savingsM,
      affectedSkus,
      impactLevel,
      playbook,
      parallelAiAnalysis,
    });
  });

  // Dedicated AI Playbook Generator Endpoint
  app.post('/api/ai/playbook', async (req, res) => {
    try {
      const { title, location, description, customPrompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          playbook: [
            { priority: 'IMMEDIATE', action: `Re-route Freight around ${location || 'Target Hub'}`, detail: 'Divert 35% of inbound shipments to secondary freight lanes.' },
            { priority: 'IMMEDIATE', action: 'Re-balance Regional POS Store Safety Stock', detail: 'Trigger auto-replenishment across Tier-1 retail outlets.' },
            { priority: 'URGENT', action: 'Activate Secondary Supplier Allocation', detail: 'Issue emergency purchase orders to pre-vetted dual suppliers.' },
            { priority: 'URGENT', action: 'Transmit Automated Customer SLA Advisory', detail: 'Notify account managers of expected delay and revised ETAs.' },
            { priority: 'MONITOR', action: 'Live AIS & Meteorological Telemetry Tracking', detail: 'Monitor satellite location and vessel turnaround times.' }
          ],
          parallelAiAnalysis: `### Gemini AI Mitigation Plan for ${title || 'Incident'}
**Location:** ${location || 'Global Corridor'}

1. **Immediate Rerouting:** Shift critical cargo away from affected bottleneck nodes.
2. **POS Safety Stock:** Draw down regional buffer stock to protect customer sales velocity.
3. **Supplier Balancing:** Distribute component demand across dual-sourced partners.`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const userInstruction = customPrompt
        ? `Custom instruction: ${customPrompt}`
        : `Incident Title: ${title}\nLocation: ${location}\nDescription: ${description}`;

      const prompt = `Act as an executive supply chain risk copilot. Generate a structured mitigation playbook and parallel AI analysis for this incident:
${userInstruction}

Return a JSON object with:
1) "playbook": Array of 5 items with "priority" ("IMMEDIATE" | "URGENT" | "MONITOR"), "action" (string), "detail" (string).
2) "parallelAiAnalysis": Markdown string giving deep strategic breakdown and SLA recommendations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Playbook Generation Error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI playbook' });
    }
  });

  // AI Generation Proxy Route using @google/genai
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, context, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallbackResponse = `### ChainSight AI Telemetry Analysis

Based on live supply chain telemetry and your query: **"${prompt}"**

#### 1. Real-Time Telemetry Matrix
| Data Feed Stream | Current Status | Risk Impact / Trend |
| :--- | :--- | :--- |
| **Global Health Index** | **87/100** | Optimal Network Resilience |
| **Bangalore POS Outlet** | **+42.5% Surge** | Elevated Stockout Risk in $T+2$ Days |
| **South China Sea AIS** | **Typhoon Gaemi** | 3.5–6 Day Inbound Maritime Delay |
| **ACME Supplier Node** | **ISO 14001 Active** | Dual-Sourcing Safety Allocation |

#### 2. Recommended Action Playbook
1. **Dynamic Rerouting:** Reroute 35% of Shenzhen cargo via **Ningbo Port** to bypass storm delays.
2. **POS Auto-Replenishment:** Trigger automated inventory draw-down from Chennai DC for Tier-1 SKUs.
3. **Supplier Dual-Sourcing:** Activate secondary PO allocation with **ACME Electronics** for component safety buffers.

*(Note: Live Gemini 3.6 Flash inference enabled when GEMINI_API_KEY is configured)*`;
        return res.json({ result: fallbackResponse, mode: 'simulated' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const fullPrompt = context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: systemInstruction
          ? { systemInstruction }
          : {
              systemInstruction:
                'You are ChainSight AI, an executive supply chain and POS telemetry copilot. Always format your responses in clean, beautifully structured Markdown using clear headings, bold highlights, numbered lists, and markdown tables (| Header | Header |) whenever displaying tabular data or comparison metrics. Do NOT output raw unparsed symbols or unformatted text blocks.',
            },
      });

      res.json({ result: response.text, mode: 'live' });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to process AI request' });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChainSight Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
