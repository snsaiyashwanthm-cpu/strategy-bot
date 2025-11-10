import streamlit as st
import google.generativeai as genai
import os
import re # We've added "re" (Regular Expressions) to help us parse the text

# --- Helper function to read knowledge files ---
def get_company_knowledge():
    knowledge_base = ""
    knowledge_dir = "company_knowledge"
    if not os.path.exists(knowledge_dir):
        return "No company knowledge found."
    for filename in os.listdir(knowledge_dir):
        if filename.endswith(".txt"):
            filepath = os.path.join(knowledge_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    knowledge_base += f.read() + "\n\n---\n\n"
            except Exception as e:
                print(f"Error reading {filename}: {e}")
    return knowledge_base
# ----------------------------------------

# --- Configure the Gemini API ---
try:
    genai.configure(api_key=st.secrets["gemini_api_key"])
    
    # --- THIS IS THE FIXED LINE ---
    model = genai.GenerativeModel('models/gemini-pro-latest')
    
except Exception as e:
    st.error(f"Error configuring the Gemini API. Did you add your key to secrets.toml? Error: {e}")
    model = None
# ----------------------------------------

# --- NEW HELPER FUNCTION FOR PARSING ---
def parse_slide_title(slide_text):
    """Extracts the 'Title:' from a slide's text to use in the expander header."""
    match = re.search(r"Title:\s*(.*)", slide_text)
    if match:
        return match.group(1).strip()
    return "Slide"
# ----------------------------------------


st.set_page_config(layout="wide") # Makes the app use the full screen width
st.title("A+ Strategy Proposal Generator 🤖")
st.markdown("---")

client_email = st.text_area("Paste client RFP, email, or objective here:", height=250)

if st.button("Generate Proposal Blueprint"):
    
    if client_email and model:
        
        with st.spinner("AI Strategist is reading all 10 case studies..."):
            company_knowledge = get_company_knowledge()
        
        # --- THIS IS THE FINAL "A++" PROMPT WITH 2-PART OUTPUT ---
        my_prompt = f"""
        # YOUR ROLE
        You are a 3-person team:
        1.  **A Senior MBB-Style Strategy Consultant:** Master of storytelling and problem-framing.
        2.  **A Proposal Team Lead:** Master of persuasive, negotiation-ready documents.
        3.  **A Research Director:** Master of data, rigor, and analysis.

        # YOUR KNOWLEDGE
        Our firm's past engagements:
        --- COMPANY KNOWLEDGE BASE ---
        {company_knowledge}
        --- END OF KNOWLEDGE BASE ---

        # YOUR INPUT
        A new client objective:
        --- CLIENT OBJECTIVE ---
        "{client_email}"
        --- END OF OBJECTIVE ---

        # YOUR CORE TASK
        Generate a comprehensive, two-part response. You MUST NOT hallucinate.

        # --- PART 1: ENGAGEMENT ANALYSIS ---
        (This part MUST come first. Be crisp, clear, and actionable. Base it *only* on the client email and our knowledge.)
        
        **1. Analysis of Client Requirements (The Core Problem):**
           * Infer the *true* decision problem as a single, precise question.
           * Cascade this into sub-decision problems and concrete research questions.
        **2. Proposed Scope of Work:**
           * Define the boundaries of the engagement. What we *will* do.
        **3. Key Assumptions:**
           * List the assumptions we are making (e.g., "Access to client's data," "Availability of key stakeholders").
        **4. Potential Risks & Mitigation:**
           * List 2-3 key risks (e.g., "Data quality issues," "Shifting market dynamics") and how we will mitigate them.
        
        # --- PART 2: PPT-READY PROPOSAL BLUEPRINT ---
        (This part comes *after* Part 1. It must be an exhaustive, slide-by-slide blueprint.)
        
        **MANDATORY REQUIREMENTS FOR PART 2:**
        You MUST adhere to these principles for the slide deck:

        1.  **Consulting Storyline (SCQA / Pyramid Principle):**
            * 
            * Structure the *entire deck* as a clear narrative arc (Situation → Complication → Question → Answer).
            * Each slide *must* have a one-line "so-what" headline (the "Key Message").

        2.  **Persuasion & Negotiation:**
            * Embed techniques: Use framing, anchoring, and social proof (by referencing our Knowledge Base).
            * Pre-empt objections: Include 1-2 slides (e.g., "Addressing Key Risks," "Why Our Firm").

        3.  **Rigor & Transparency:**
            * Clearly label all assumptions.
            * For data, specify the "Data Needed & Source" (e.g., "Client's internal sales data," "Third-party market report").
            * Do NOT invent facts. State what analysis is *needed*.

        4.  **PPT-Ready Output (Your Main Format):**
            * For *every* slide (including section dividers), you must provide:
                * **Slide [Number] ([Section Name])**
                * **Title:** (e.g., "Our Analysis Shows Two Core Churn Drivers")
                * **Purpose:** (e.g., "To build conviction that the problem is X and Y")
                * **Key Message (Headline):** (e.g., "Subscriber churn is driven by poor onboarding and a lack of niche content")
                * **Key Content (Bullets):** (3-6 bullets of the core argument)
                * **Visual Spec:** (e.g., "Waterfall chart," "2x2 matrix," "Data table") 
                * **Data Needed & Source:** (e.g., "Client's Google Analytics for onboarding," "Internal user-segmentation data")
                * **Build Guidance:** (e.g., "1. Show chart title. 2. Animate each waterfall block. 3. Show final % drop-off.")

        5.  **Depth:**
            * Produce a long, thorough result. A typical proposal deck has 15-25 slides. Do not be brief.
            * Create section dividers (e.g., "1. Understanding the Problem", "2. Our Proposed Approach", "3. Engagement Details", "4. Why Our Firm").

        # YOUR THOUGHT PROCESS (Follow this!)
        1.  **Analyze & Frame:** Carefully read the client email.
        2.  **Generate Part 1:** Write the complete "PART 1: ENGAGEMENT ANALYSIS" with all four sub-sections.
        3.  **Set the Storyline:** Based on Part 1, create the SCQA for the slide deck.
        4.  **Select Knowledge:** Which 1-2 case studies are *most relevant* as "social proof"? I will cite these in the deck.
        5.  **Generate Part 2:** Go slide-by-slide, from 1 to ~20, following the "PPT-Ready Output" format *exactly* for each one.

        Now, begin.
        """
        
        with st.spinner("Connecting to Gemini API. The AI Partner is drafting the Engagement Analysis and building the slide deck..."):
            
            try:
                # --- This is the same API call ---
                response = model.generate_content(my_prompt)
                
                # --- THIS IS THE "2-PART" LAYOUT CODE ---
                
                # 1. Split the entire response into parts
                # We split by "PART 1" or "Slide [Number]"
                parts = re.split(r"(?=PART 1: ENGAGEMENT ANALYSIS|Slide \[\d+\])", response.text, flags=re.IGNORECASE)
                
                if not parts:
                    st.markdown(response.text) # Fallback
                
                # 2. Display the parts in a clean layout
                st.header("Your Client-Ready Proposal")
                st.markdown("---")
                
                for part in parts:
                    if not part.strip():
                        continue
                    
                    if "PART 1: ENGAGEMENT ANALYSIS" in part:
                        # Display Part 1 (The Analysis) with a special highlight
                        st.subheader("Part 1: Engagement Analysis")
                        st.info(part.replace("PART 1: ENGAGEMENT ANALYSIS", "").strip()) # Shows in a blue box
                    
                    elif "Slide" in part:
                        # This is a slide. Put it in a clickable expander
                        
                        # Find the slide number and title for the header
                        slide_header = "Slide"
                        match = re.search(r"(Slide \[\d+\] \([^\)]+\))", part, re.IGNORECASE)
                        if match:
                            slide_header = match.group(1).strip()
                        
                        # Use the "Title:" line for a cleaner header
                        title = parse_slide_title(part)
                        
                        # Initialize the "Part 2" header if it hasn't been shown
                        if "part_2_header_shown" not in st.session_state:
                            st.subheader("Part 2: PPT-Ready Proposal Blueprint")
                            st.session_state.part_2_header_shown = True
                        
                        with st.expander(f"**{slide_header}: {title}**", expanded=False):
                            st.markdown(part) # Print the raw markdown *inside* the expander
                
                # Clear the session state for the next run
                if "part_2_header_shown" in st.session_state:
                    del st.session_state.part_2_header_shown
                            
            except Exception as e:
                st.error(f"An error occurred while generating the response: {e}")
                st.markdown(f"**Raw Error Output:**\n{e}") # For debugging
    
    elif not model:
        st.error("Model is not configured. Please check your API key in secrets.toml and restart.")
    else:
        # Show an error if the text box is empty
        st.error("Please paste the client objective first!")
        
        # --- THIS IS YOUR NEW "HELP BOT" WIDGET ---

# Replace the "YOUR-CHATBOT-ID-GOES-HERE" with the Chatbot ID you just copied from Chatbase.

# Replace this with the *exact* embed code you got from Chatbase
chatbot_code = """
<script>
  window.chatbaseConfig = {
    chatbotId: "au9YsHjES4gc3mqHjPrOK",
  }
</script>
<script src="https://www.chatbase.co/embed.min.js" id="au9YsHjES4gc3mqHjPrOK" defer></script>
"""

# This new line injects the code directly into the page
st.html(chatbot_code)
# -------------------------------------------------