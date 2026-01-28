
import streamlit as st
import os
from PIL import Image
from services.gemini_service import analyze_infrastructure, cross_check_findings
from styles import get_custom_css

# --- CONFIGURATION ---
st.set_page_config(
    page_title="BYTECODE - Infrastructure Intelligence",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Inject CSS
st.markdown(get_custom_css(), unsafe_allow_html=True)

# --- SESSION STATE ---
if 'user_role' not in st.session_state:
    st.session_state.user_role = None
if 'view' not in st.session_state:
    st.session_state.view = 'LANDING'
if 'active_report' not in st.session_state:
    st.session_state.active_report = None
if 'analysis_result' not in st.session_state:
    st.session_state.analysis_result = None

def set_role(role):
    st.session_state.user_role = role
    st.session_state.view = 'DASHBOARD'

def logout():
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    st.rerun()

# --- UI COMPONENTS ---

def render_header():
    cols = st.columns([1, 4, 1])
    with cols[0]:
        st.markdown(f"""
            <div class="logo-container">
                <div class="logo-box">⚡</div>
                <div>
                    <div class="logo-text">BYTECODE</div>
                    <div class="logo-subtext">Cortex Edge Intelligence</div>
                </div>
            </div>
        """, unsafe_allow_html=True)
    with cols[2]:
        if st.session_state.user_role:
            st.button("Logout", on_click=logout, use_container_width=True)

def render_landing():
    st.markdown("<div style='height: 40px;'></div>", unsafe_allow_html=True)
    st.markdown("<h1 class='hero-title'>Residential <br/><span class='text-blue'>Local Edge Intelligence</span></h1>", unsafe_allow_html=True)
    st.markdown("<p class='hero-subtitle'>High-performance local inference simulating Snowflake Cortex. Analyze infrastructure defects and manage safety ledgers without external API dependencies.</p>", unsafe_allow_html=True)
    
    st.info("✅ **Cortex Edge Active:** System is running in Local Neural Mode. No API Key required.")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
            <div class="role-card">
                <div class="icon-circle blue-bg"><i class="fas fa-magnifying-glass-house"></i></div>
                <h3>Home Resident</h3>
                <p>Lookup safety reports or perform a self-inspection scan powered by local Cortex Logic.</p>
            </div>
        """, unsafe_allow_html=True)
        if st.button("Resident Entrance", key="res_ent", use_container_width=True):
            set_role("NORMAL")
            st.rerun()

    with col2:
        st.markdown("""
            <div class="role-card">
                <div class="icon-circle amber-bg"><i class="fas fa-user-shield"></i></div>
                <h3>Inspector</h3>
                <p>Conduct audits, verify local findings, and release certified property safety reports to the ledger.</p>
            </div>
        """, unsafe_allow_html=True)
        if st.button("Inspector Entrance", key="ins_ent", use_container_width=True):
            set_role("INSPECTOR")
            st.rerun()

def render_normal_workflow():
    st.markdown("## Resident Intelligence Dashboard")
    
    tab1, tab2 = st.tabs(["🔍 Property Lookup", "📷 Local Neural Scan"])
    
    with tab1:
        st.markdown("### Search Records")
        search_col1, search_col2 = st.columns([3, 1])
        with search_col1:
            query = st.text_input("House Number", placeholder="Try '124'...", label_visibility="collapsed")
        with search_col2:
            search_btn = st.button("Query Ledger", use_container_width=True)
        
        if search_btn:
            if query == "124":
                st.session_state.active_report = {
                    "id": "BYTE-9921",
                    "address": "124 Evergreen Terrace, Springfield",
                    "risk_score": 45,
                    "summary": "Moderately stable. Minor structural settling in kitchen area and old wiring in attic require professional attention.",
                    "inspector": "Inspector Smith"
                }
            else:
                st.error("Property not found. Try house number '124'.")
        
        if st.session_state.active_report:
            rep = st.session_state.active_report
            st.markdown(f"""
                <div class="report-display">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span style="background: rgba(37,99,235,0.2); color: #3b82f6; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; border: 1px solid rgba(37,99,235,0.3);">ID: {rep['id']}</span>
                            <h2 style="margin-top: 5px; color: white;">{rep['address']}</h2>
                        </div>
                        <div class="risk-badge">Risk: {rep['risk_score']}</div>
                    </div>
                    <div class="summary-box" style="margin-top: 15px;">
                        <strong style="color: #3b82f6;">Edge Summary:</strong><br/>
                        <p style="margin-top: 8px; font-style: italic; color: #cbd5e1;">"{rep['summary']}"</p>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin-top: 15px;">Audit by {rep['inspector']} • Verified by Snowflake Cortex Simulation</p>
                </div>
            """, unsafe_allow_html=True)

    with tab2:
        st.markdown("### Start Self Inspection")
        col_l, col_r = st.columns(2)
        with col_l:
            room = st.selectbox("Area to Inspect", ["Kitchen", "Bathroom", "Living Room", "Bedroom", "Exterior", "Attic/Basement"])
            method = st.radio("Input Type", ["Real-time Photo (Camera)", "Upload Photo", "Textual Description"])
            description = st.text_area("Observations", placeholder="Describe any cracks, leaks, or electrical concerns...")
        
        with col_r:
            image_data = None
            if method == "Real-time Photo (Camera)":
                cam_file = st.camera_input("Capture Defect")
                if cam_file:
                    image_data = Image.open(cam_file)
            elif method == "Upload Photo":
                uploaded_file = st.file_uploader("Upload Evidence", type=["jpg", "png", "jpeg"])
                if uploaded_file:
                    image_data = Image.open(uploaded_file)
                    st.image(image_data, caption="Evidence Preview", use_container_width=True)
            else:
                st.info("Descriptive mode active. Local Cortex Edge reasoning active.")

        if st.button("Execute Local Scan", type="primary", use_container_width=True):
            if not image_data and not description:
                st.warning("Please provide either a photo or a description for analysis.")
            else:
                with st.spinner("Processing local heuristics..."):
                    result = analyze_infrastructure(room, description, image_data)
                    st.session_state.analysis_result = result
                    
                res = st.session_state.analysis_result
                if res and "findings" in res:
                    st.success("Analysis Complete (Local Edge)")
                    st.markdown(f"""
                        <div class="report-display" style="border-top: 4px solid #2563eb;">
                            <h3 style="color: white; margin-bottom: 5px;">Edge Analysis Summary</h3>
                            <p style="color: #cbd5e1; font-style: italic;">{res.get('summary', '')}</p>
                            <p style="color: #94a3b8; font-size: 14px; margin-top: 10px;"><strong>Overall Risk Score: {res.get('riskScore', 0)}/100</strong></p>
                        </div>
                    """, unsafe_allow_html=True)
                    
                    for finding in res.get('findings', []):
                        with st.expander(f"⚠️ {finding['aiTag']} - Severity: {finding['severity'].upper()}"):
                            st.write(f"**Description:** {finding['description']}")
                            st.progress(finding['confidence'], text=f"Edge Confidence: {int(finding['confidence']*100)}%")
                else:
                    st.error(res.get("summary", "Analysis failed unexpectedly."))

def render_inspector_workflow():
    st.markdown("## Professional Inspector Portal")
    st.info("Local Enterprise Session: Active (Zero-API)")
    
    st.markdown("### Pending Field Audits")
    pending = [
        {"house": "124", "status": "AI Pre-Scan Ready", "risk": 45, "address": "124 Evergreen Terrace"},
        {"house": "742", "status": "Resident Submission", "risk": 12, "address": "742 Maple St"}
    ]
    
    for p in pending:
        with st.expander(f"House #{p['house']} - {p['address']}"):
            st.write(f"**Current Risk Score:** {p['risk']}")
            manual_notes = st.text_area(f"Field Observations for #{p['house']}", key=f"notes_{p['house']}")
            
            if st.button(f"Cross-Check findings for #{p['house']}", key=f"btn_{p['house']}"):
                with st.spinner("Reasoning engine auditing manual vs local findings..."):
                    mock_ai = [{"id": "1", "description": "Minor wall crack", "severity": "low", "aiTag": "STRUCTURAL"}]
                    audit_result = cross_check_findings(manual_notes, mock_ai)
                    st.markdown(f"<div class='audit-result'>{audit_result}</div>", unsafe_allow_html=True)
            
            st.button(f"Approve & Sync #{p['house']} to Snowflake", key=f"release_{p['house']}")

# --- MAIN APP LOGIC ---
render_header()

if st.session_state.view == 'LANDING':
    render_landing()
elif st.session_state.view == 'DASHBOARD':
    if st.session_state.user_role == 'NORMAL':
        render_normal_workflow()
    else:
        render_inspector_workflow()

st.markdown("""
    <div class="footer">
        © 2024 BYTECODE • Local Cortex Simulation • Secure Infrastructure Ledger
    </div>
""", unsafe_allow_html=True)
