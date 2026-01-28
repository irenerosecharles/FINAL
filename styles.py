
def get_custom_css():
    """Returns a cleaned CSS string for Streamlit injection, preventing raw text leak."""
    return """<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
.stApp, [data-testid="stAppViewContainer"], [data-testid="stHeader"], [data-testid="stSidebar"] {
    background-color: #0f172a !important;
    color: #f8fafc !important;
}
.stMarkdown, p, span, label, h1, h2, h3, h4, h5, h6, .stSelectbox label, .stTextArea label {
    color: #f8fafc !important;
    font-family: 'Inter', sans-serif !important;
}
.logo-container { display: flex; align-items: center; gap: 12px; padding: 5px 0; }
.logo-box { background: #2563eb; color: white !important; padding: 6px 12px; border-radius: 10px; font-weight: 900; font-size: 20px; box-shadow: 0 0 15px rgba(37, 99, 235, 0.4); }
.logo-text { font-weight: 900; font-size: 1.1rem; color: #ffffff !important; line-height: 1; }
.logo-subtext { font-size: 8px; color: #64748b !important; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.hero-title { text-align: center; font-size: 3rem; font-weight: 900; color: #ffffff !important; margin-bottom: 8px; }
.text-blue { color: #3b82f6 !important; }
.hero-subtitle { text-align: center; color: #94a3b8 !important; font-size: 1.05rem; max-width: 700px; margin: 0 auto 30px auto; }
.role-card { background: #1e293b; border: 1px solid #334155; border-radius: 1.5rem; padding: 2.5rem; text-align: center; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.icon-circle { width: 60px; height: 60px; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; font-size: 24px; }
.blue-bg { background: rgba(59, 130, 246, 0.15); color: #3b82f6 !important; border: 1px solid #2563eb; }
.amber-bg { background: rgba(245, 158, 11, 0.15); color: #f59e0b !important; border: 1px solid #d97706; }
.report-display { background: #1e293b; border: 1px solid #334155; border-radius: 1.25rem; padding: 1.5rem; margin-top: 1.5rem; }
.risk-badge { background: #7f1d1d; color: #fca5a5 !important; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; }
.summary-box { background: #0f172a; border-left: 3px solid #3b82f6; padding: 1rem; border-radius: 0 8px 8px 0; }
.audit-result { background: #064e3b; border: 1px solid #065f46; padding: 1rem; border-radius: 0.75rem; color: #ecfdf5 !important; margin-top: 15px; }
.footer { text-align: center; padding: 30px 0; color: #475569 !important; font-size: 0.75rem; font-weight: 600; }
.stTextInput input, .stTextArea textarea, .stSelectbox [data-baseweb="select"] {
    background-color: #0f172a !important;
    color: white !important;
    border: 1px solid #334155 !important;
}
.stButton > button {
    background-color: #1e293b !important;
    color: white !important;
    border: 1px solid #334155 !important;
    border-radius: 8px !important;
    font-weight: 700 !important;
}
.stButton > button:hover { border-color: #3b82f6 !important; color: #3b82f6 !important; }
.stExpander, .stTabs [data-baseweb="tab-list"], .stTabs [data-baseweb="tab-panel"] {
    background-color: #0f172a !important;
}
.stExpander { border: 1px solid #334155 !important; }
</style>"""
