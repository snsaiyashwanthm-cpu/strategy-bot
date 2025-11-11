/**
 * This is our secure Cloudflare Worker backend.
 * It holds our secret API key, our proprietary RAG case studies, and our "Senior Partner" meta-prompt.
 * It is the ONLY part of our system that talks to the Google Gemini API.
 */

// These are the 10 exhaustive, in-depth case studies you requested.
// This is our proprietary data and is kept secure on the backend.
const RAG_KNOWLEDGE_BASE = `
---
File: case_study_1.txt (Gen AI Strategy)
Project: Generative AI Strategic Assessment & Enterprise-Wide Roadmap
Client: Global SaaS Leader (Tech / B2B)
Problem: The client's board was concerned about being disrupted by Gen AI. The firm had no central strategy, and multiple departments were starting "random acts of AI" (e.g., ad-hoc ChatGPT subscriptions) with no clear ROI, creating data security risks and wasted, uncoordinated spend.
Our Role (Strategy/Advisory):
1.  **Phase 1: Gen AI Readiness & Maturity Assessment (Weeks 1-3):** We benchmarked the client's data maturity, tech stack (current data-lakes, CRM, ERP), and internal talent against their 3 key competitors (e.g., Salesforce, Oracle). This identified critical gaps in their data governance and internal skillsets.
2.  **Phase 2: Value-Chain Analysis & Use Case Prioritization (Weeks 4-6):** We ran C-suite and VP-level workshops across 5 business units (Marketing, Sales, R&D, Support, HR). We mapped their entire value chain and identified 45+ potential Gen AI use cases. We then applied a custom scoring matrix (Value vs. Feasibility vs. Risk) to prioritize 3 "high-impact, low-effort" initiatives: 
    (a) L1/L2 Customer Support Automation
    (b) AI-Powered "Agent Co-pilot" for L3 support (to reduce issue resolution time)
    (c) AI-Augmented Code Generation & Review for R&D.
3.  **Phase 3: Business Case & Financial Model (Weeks 7-8):** We developed the end-to-end business case for the 3 prioritized initiatives. Our model showed a $2.2M initial investment could yield a 30% reduction in support costs (OpEx) and a 20-point CSAT increase within 18 months.
4.  **Phase 4: Strategic Roadmap & "Center of Excellence" (CoE) Design (Weeks 9-12):** We delivered a 24-month strategic implementation roadmap, which included:
    (a) A "Build vs. Buy vs. Partner" framework for the core AI platform.
    (b) A detailed vendor-agnostic technology architecture (recommending a Vector DB, etc.).
    (c) The full operating model and charter for a new "AI Center of Excellence" (CoE) to govern all future AI projects, manage data, and ensure ethical compliance.
Result: Our business case was presented to the board, securing the full $2.2M budget. The client is now following our roadmap, starting with the "Agent Co-pilot" initiative, which is on track to reduce agent onboarding time by 50%.
---
File: case_study_2.txt (5G GTM Strategy)
Project: 5G & Private Network (B2B) Go-to-Market Strategy & Market Sizing
Client: Tier-1 National Telecom Carrier (Telecom)
Problem: The client had invested over $10B in 5G spectrum (CapEx) with almost zero net-new consumer revenue. The board demanded a credible strategy to monetize this investment by unlocking new, high-margin B2B revenue streams.
Our Role (Strategy/Advisory):
1.  **Market Opportunity Analysis & Sizing (TAM/SAM/SOM):** We conducted a 6-week market research study, sizing the total addressable B2B market (TAM) for 5G services at $80B by 2030. We identified "Private 5G" and "Multi-Access Edge Compute (MEC)" as the two largest and highest-margin value pools.
2.  **Vertical Prioritization & Deep-Dive:** We analyzed 8 industry verticals (Manufacturing, Logistics, Healthcare, Retail, etc.). We ran a quantitative model to score each vertical based on "Need" (e.g., requires low-latency automation) and "Willingness to Pay." Our analysis *conclusively* recommended 3 high-potential "anchor" segments to target first: 
    (a) Smart Manufacturing (for robotics & predictive maintenance)
    (b) Logistics/Ports (for asset tracking & automated guided vehicles)
    (c) Tele-health (for remote diagnostics & AR-assisted surgery).
3.  **Strategic GTM Plan & Business Model:** We developed the complete GTM plan. This was not just a report; it was an operational blueprint. It included:
    (a) Partnership Model Advisory (e.g., how to partner with AWS, Microsoft Azure, and Siemens).
    (b) Pricing & Packaging Strategy (e.g., "Good-Better-Best" tiers for Private 5G).
    (c) Sales Force Enablement (e.g., how to re-train their sales team from selling SIM cards to selling complex "solution-based" 5G services).
4.  **Financial Modeling:** We built the 5-year financial model for the new "B2B Solutions" division, projecting a $750M new revenue pipeline by Year 3.
Result: Our strategy was adopted in full by the board. The client launched two new B2B service lines. Using our "anchor client" GTM plan, they successfully secured a flagship $30M "Smart Factory" Private 5G contract with a major automotive manufacturer within 9 months.
---
File: case_study_3.txt (Media Subscriber Strategy)
Project: Content Strategy & Subscriber Churn Reduction (Market Research & Analysis)
Client: Major Media & Entertainment Studio (Media)
Problem: The client's new streaming platform (a "Netflix-killer") was facing a disastrously high subscriber churn rate of 8% per month. Their multi-million dollar content acquisition budget was based on "gut-feel" and executive taste, not data, leading to a terrible content-ROI.
Our Role (Strategy/Advisory):
1.  **Data-Driven Churn Analysis (Market Research):** We performed a deep-dive data analysis of their 15M+ subscriber base. We analyzed viewing habits, content preferences, and session data to identify the key *leading indicators* of churn.
2.  **Key Insight Generation:** Our analysis discovered two critical, non-obvious facts:
    (a) Churn was *not* driven by a lack of "blockbusters." It was driven by a failure to engage users *after* they finished the one show they signed up for.
    (b) Subscribers who watched 2 or more "niche" titles (e.g., a specific sub-genre of sci-fi) had a 5x higher retention rate.
3.  **Content Strategy Recommendation:** Based on this data, we advised the client to stop "outbidding" Netflix for A-list blockbusters. Instead, we recommended they shift 20% of their acquisition budget (approx. $100M) from "Blockbuster" to 3 specific "high-value" niche content genres that our analysis showed drove the highest retention and "LTV" (Lifetime Value).
4.  **Retention Program Strategy:** We provided a strategic framework for a new "proactive retention" program, advising the marketing team on *which* offers to send (e.g., "1-month free") to *which* "at-risk" segments for maximum impact and minimal margin loss.
Result: The client adopted our new data-driven content-spend model. Our strategy directly led to a 12% reduction in subscriber churn (saving an estimated $40M annually) and a 25% improvement in their content-acquisition ROI.
---
File: case_study_4.txt (Industry 4.0 Strategy)
Project: "Smart Factory" (Industry 4.0) Strategic Roadmap & OEE Benchmarking
Client: Automotive Parts Manufacturer (Electronics/Industrial)
Problem: The client's OEE (Overall Equipment Effectiveness) was stagnant at 60%, 15 points behind their best-in-class competitors. This was causing them to lose bids and suffer from unplanned downtime. They knew "Industry 4.0" was the answer but had no idea where to start.
Our Role (Strategy/Advisory):
1.  **OEE Benchmarking & Gap Analysis:** We conducted a 4-week on-site diagnostic of their 5 key production lines. We benchmarked their OEE, scrap rates, and downtime against 20 competitors to identify and *quantify* the "OEE gap."
2.  **Value-Driver Identification:** Our analysis proved that 70% of the OEE gap was from "unplanned machine downtime" on their CNC milling machines. We identified Predictive Maintenance (PdM) as the #1, highest-ROI value-driver, not a "full-scale digital twin" (which they *thought* they needed).
3.  **Industry 4.0 Strategic Roadmap:** We developed a pragmatic, 3-year "Smart Factory" strategy. We created the detailed business case showing a 40% reduction in downtime was achievable with a $1.9M pilot program for PdM, which would pay for itself in 9 months.
4.  **Vendor Landscape & Advisory:** We provided an independent advisory brief on the "IoT / Digital Twin / PdM" vendor landscape, shortlisting 3 top vendors (e.g., Siemens, Rockwell, an AI startup) to guide their procurement and partnership strategy, saving them from vendor lock-in.
Result: The board approved the $1.9M pilot based *directly* on our business case. The client followed our strategic roadmap, and increased OEE from 60% to 78% in 2 years, making them competitive again.
---
File: case_study_5.txt (Semiconductor R&D Strategy)
Project: AI in R&D - Effectiveness & Strategy (Market Research)
Client: Fabless Semiconductor Designer
Problem: Soaring R&D costs and multi-year design cycles for new 3nm ASICs. The "verification" phase (bug-hunting) was a major bottleneck, and competitors were getting to market 6-9 months faster.
Our Role (Strategy/Advisory):
1.  **R&D Lifecycle Benchmarking:** We analyzed their 24-month chip design lifecycle, benchmarking their "time-to-tapeout" against 5 key competitors. We identified the verification phase as the primary bottleneck, costing 30% more time than the industry best-in-class.
2.  **AI in R&D Opportunity Sizing (Market Research):** We researched and presented the entire "AI in EDA (Electronic Design Automation)" landscape. We identified "AI-based verification" and "Reinforcement Learning (RL) for chip layout" as two breakthrough strategic opportunities. We quantified a potential 30% reduction in cycle time.
3.  **R&D Data Strategy Advisory:** We delivered the strategic advisory for a new R&D data platform. We outlined the "must-have" capabilities to enable this (e.g., centralizing all R&D, verification, and fab data) and provided a "data-governance" framework for them to implement.
Result: Our strategic recommendations were adopted by the CTO. The client initiated a new "AI for R&D" program that is on track to achieve a 10% improvement in PPA (Power, Performance, Area) on its next-gen chip.
---
File: case_study_6.txt (Cloud Strategy & TCO Analysis)
Project: Hybrid Cloud Transformation Strategy & Financial Modeling
Client: Legacy Retail Bank (Financial Services)
Problem: The on-premise mainframe infrastructure was a strategic bottleneck. Dev cycles for new digital banking apps were 6+ months, infrastructure costs were high, and they couldn't compete with new digital-native "fintech" banks.
Our Role (Strategy/Advisory):
1.  **TCO & Application Portfolio Analysis:** We analyzed their 100+ critical applications for cloud-readiness. We created a detailed TCO (Total Cost of Ownership) financial model that proved a hybrid-cloud model could reduce their infrastructure costs by 35% over 5 years.
2.  **Hybrid Cloud Strategy (Advisory):** We advised on the optimal "to-be" hybrid strategy. Our recommendation was to keep the core ledger system on-prem (for regulatory compliance) but migrate all customer-facing apps to a "multi-cloud" mix of AWS (for new app dev) and Azure (for their data warehouse).
3.  **Cloud Operating Model Design (Advisory):** We delivered the strategic framework for a new "Cloud Center of Excellence" (CCOE). This was an organizational blueprint, advising on the new governance, FinOps (cost management), and SecOps processes required to manage a complex multi-cloud environment.
Result: The client adopted our strategy, which unlocked a 70% faster "time-to-market" for new digital products (from 6 months to 3 weeks).
---
File: case_study_7.txt (Cybersecurity Strategy)
Project: "Zero Trust" Security Strategy & Post-Breach Roadmap
Client: Large Healthcare Provider
Problem: A major ransomware attack exposed 1M+ patient records (PHI). The board had lost confidence in the CISO. Their legacy "castle-and-moat" security model (firewalls, VPNs) was proven obsolete.
Our Role (Strategy/Advisory):
1.  **Post-Breach Capability Assessment (Advisory):** We conducted a rapid 3-week assessment of their entire security posture, people, and processes. We benchmarked them against the NIST "Zero Trust" framework.
2.  **Strategic Gap Analysis:** We identified 3 critical, high-risk gaps: (a) weak identity management (everyone was an "admin"), (b) a "flat" network allowing the ransomware to spread (lateral movement), and (c) a slow, reactive Security Operations Center (SOC).
3.  **"Zero Trust" Strategic Roadmap:** We developed the 18-month strategic roadmap to move from their legacy model to a "Zero Trust" posture ("never trust, always verify"). This was a step-by-step plan for implementing new policies like identity-aware proxies and micro-segmentation.
4.  **SOC Operating Model Advisory:** We advised on the new SOC operating model and provided the vendor-agnostic capability matrix for the AI-powered SIEM/SOAR tech stack required to reduce "mean time to detect" a threat from days to minutes.
Result: Our strategy and roadmap were presented directly to the board and adopted in full. The client successfully met all HIPAA regulatory compliance requirements within 12 months.
---
File: case_study_8.txt (Telecom OpEx Reduction Strategy)
Project: Network OpEx Reduction & AIOps Strategy
Client: Tier-1 Mobile Network Operator
Problem: Extremely high operating costs (OpEx) for managing their 50,000+ cell towers. Network faults were handled *reactively*, requiring expensive, inefficient emergency "truck rolls" (dispatching technicians).
Our Role (Strategy/Advisory):
1.  **OpEx Driver Analysis (Market Research):** We analyzed all network OpEx drivers and found that "truck rolls" represented a $50M+ annual cost and were the #1 source of inefficiency.
2.  **AIOps Business Case (Advisory):** We developed the complete business case for an "AIOps" (AI for IT Operations) strategy. We proved that a *predictive* maintenance model (using AI to predict tower failures *before* they happen) could reduce truck rolls by 30%.
3.  **Data Strategy Advisory:** We outlined the data strategy required to enable AIOps. This involved advising them on how to centralize their 1,000s of disparate data streams (equipment logs, weather data, network alarms) into a unified data lake to feed the AIOps model.
Result: The client adopted our strategy. Our business case directly led to a 30% reduction in "truck rolls," saving them an estimated $50M annually.
---
File: case_study_9.txt (Media Subscriber Strategy - Market Research)
Project: Digital Subscriber Acquisition & Retention Strategy
Client: Global News & Media Publisher
Problem: A forced strategic shift from ad-based revenue to subscriptions. Their generic "most popular articles" content was failing to engage users or drive conversions.
Our Role (Strategy/Advisory - Market Research):
1.  **Market Research & User Segmentation:** We conducted an in-depth market research study, including 20 stakeholder interviews and a survey of 5,000 readers, to segment their 10M+ user base. We identified a "high-value" niche segment ("Passionate Professionals") that was 5x more likely to subscribe.
2.  **Personalization Strategy (Advisory):** We developed the strategy to move from a "one-size-fits-all" model to a "hyper-personalization" engine to target this new segment.
3.  **Roadmap & Recommendation:** We delivered the strategic roadmap for a new recommender system and A/B testing framework. We advised them on *how* to leverage their first-party data to create a "sticky" user experience.
Result: Our strategy led to a 40% increase in click-through-rate (CTR) on recommended articles and a 5% lift in subscription conversions.
---
File: case_study_10.txt (Electronics Supply Chain Strategy)
Project: Supply Chain Resilience & Risk Advisory
Client: Top-5 Consumer Electronics Company
Problem: Extreme supply chain volatility. They had "stock-outs" on 3 flagship products (costing them an estimated $500M in revenue) because they were "blind" to disruptions in their Tier-2 and Tier-3 supplier base in Asia.
Our Role (Strategy/Advisory):
1.  **Supply Chain Vulnerability Analysis:** We conducted an in-depth analysis of their multi-tier supply chain. We mapped their top 100 critical components (chips, screens) and identified 5 "single-source, high-risk" supplier vulnerabilities.
2.  **Strategic Recommendation (Advisory):** We recommended a new supply chain strategy based on two pillars:
    (a) A "Digital Twin" of their supply chain for real-time visibility.
    (b) An "AI Risk Sensing" platform to monitor 1M+ data sources (news, weather, shipping, labor strikes) to predict disruptions.
3.  **Business Case & Modeling:** We modeled the ROI for this new strategy. We proved it could prevent 60% of stock-out events by providing 3-4 weeks of advance warning, delivering a 10x ROI on the project cost.
Result: The client's COO adopted our recommendation. The new "AI Risk Sensing" platform is now a core part of their quarterly S&OP (Sales & Operations Planning) process.
---
`;

// This is the JSON schema that we *demand* the AI responds with.
// This makes our output 100% reliable for parsing and for the PPTx export.
const responseSchema = {
    type: "OBJECT",
    properties: {
        "part1_analysis": {
            type: "OBJECT",
            properties: {
                "core_problem": { type: "STRING" },
                "scope_of_work": { type: "STRING" },
                "assumptions": { type: "ARRAY", items: { type: "STRING" } },
                "risks": { type: "ARRAY", items: { type: "STRING" } }
            }
        },
        "part2_blueprint": {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "slide_number": { type: "NUMBER" },
                    "section": { type: "STRING" },
                    "title": { type: "STRING" },
                    "purpose": { type: "STRING" },
                    "key_message": { type: "STRING" },
                    "key_content": { type: "ARRAY", items: { type: "STRING" } },
                    "visual_spec": { type: "STRING" },
                    "data_needed": { type: "STRING" },
                    "build_guidance": { type: "STRING" }
                }
            }
        }
    }
};

/**
 * This is the main Cloudflare Worker function.
 * It's the secure backend that runs on the server.
 */
export async function onRequestPost(context) {
    try {
        // 1. Get the prompt data from the frontend (index.html)
        const requestData = await context.request.json();
        const { industry, persona, objective, context: clientContext } = requestData;

        // 2. Get the secret API key from Cloudflare's *secure* environment
        // We will set this in the Cloudflare dashboard.
        const API_KEY = context.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return new Response(JSON.stringify({ error: "API key not configured by admin" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${API_KEY}`;
        
        // 3. This is the "A++" Senior Partner Meta-Prompt.
        // It's kept here on the server, hidden from the user.
        const finalPrompt = `
            # YOUR ROLE
            You are a 3-person team:
            1.  **A Senior MBB-Style Strategy Consultant:** Master of storytelling and problem-framing.
            2.  **A Proposal Team Lead:** Master of persuasive, negotiation-ready documents.
            3.  **A Research Director:** Master of data, rigor, and analysis.

            # YOUR STYLE (MANDATORY)
            ### style ###
            Avoid fancy jargon. Write normally. 
            You are forbidden to use complex English words.
            But you will be penalized & fined $1000 if you use the words from the ### ban list ###. 
            If you use one word from the list, I will stop the generation right away.

            ### ban list ###
            Hurdles
            Bustling
            Harnessing
            Unveiling the power 
            Realm 
            Depicted 
            Demistify 
            Insurmountable
            New Era 
            Poised 
            Unravel
            Entanglement
            Unprecedented
            Eerie connection
            unliving 
            Beacon 
            Unleash 
            Delve 
            Enrich 
            Multifaced 
            Elevate
            Discover
            Supercharge
            Unlock
            Unleash
            Tailored
            Elegant
            Delve
            Dive
            Ever-evolving
            pride
            Realm
            Meticulously
            Grappling
            Weighing
            Picture
            Architect
            Adventure
            Journey
            Embark
            Navigate
            Navigation
            dazzle
            tapestry
            ### ban list ###
            ### style ###

            No more “dive,” “realm,” or “unveiling” nonsense. 
            Just clear, normal English—every time.
            _____________

            # YOUR KNOWLEDGE
            This is our firm's proprietary list of past engagements. You MUST use this as social proof.
            --- COMPANY KNOWLEDGE BASE ---
            ${RAG_KNOWLEDGE_BASE}
            --- END OF KNOWLEDGE BASE ---

            # YOUR INPUT
            A new client objective:
            ---
            **Client Industry:** ${industry || 'Not Provided'}
            **Core Objective:** ${objective}
            **Known Context:** ${clientContext || 'Not Provided'}
            ---

            # YOUR PERSONA (MANDATORY)
            You MUST adopt the following strategic persona for this proposal: **${persona}**
            * If 'Aggressive Growth', focus on market entry, GTM, TAM/SAM, new products, and gaining market share.
            * If 'Efficiency & Optimization', focus on cost reduction, process automation, OpEx, and profitability.
            * If 'Risk & Resilience', focus on cybersecurity, supply chain, regulatory compliance, and business continuity.

            # YOUR CORE TASK
            Generate a comprehensive, two-part response. You MUST NOT hallucinate.
            You MUST return *ONLY* a single, valid JSON object that adheres to the provided schema. Do not add any text before or after the JSON.

            # --- PART 1: ENGAGEMENT ANALYSIS ---
            (Fill this part of the JSON based on the client input and your persona.)
            
            **1. Analysis of Client Requirements (The Core Problem):**
               * Infer the 'true' decision problem as a single, precise question.
            **2. Proposed Scope of Work:**
               * Define the boundaries of the engagement.
            **3. Key Assumptions:**
               * List 3-4 key assumptions.
            **4. Potential Risks & Mitigation:**
               * List 2-3 key risks and their mitigations.
            
            # --- PART 2: PPT-READY PROPOSAL BLUEPRINT ---
            (Fill this part of the JSON based on the client input and your persona. Create 15-20 slides.)
            
            **MANDATORY REQUIREMENTS FOR PART 2:**
            * **Consulting Storyline (SCQA):** The slide order *must* follow a clear SCQA narrative arc.
            * **Persuasion:** Use anchoring and social proof (by referencing the Knowledge Base in the 'key_content').
            * **Rigor:** Do NOT invent facts. 'data_needed' should state what analysis is *needed*.
            * **Format:** Adhere *perfectly* to the JSON schema for every slide.
        `;
        
        // 4. Make the *real* API call from the secure backend to Google
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: finalPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google API Error: ${errorData.error.message || "Failed to fetch"}`);
        }

        // 5. Send the successful response back to the frontend (index.html)
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}