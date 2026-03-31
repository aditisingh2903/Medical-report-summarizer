import { useState } from 'react'
import api from "../api.js";
//import Loader from '../components/Loader.jsx'

//const [isLogin, setIsLogin] = useState(true);

const BASE_URL = 'http://localhost:5000'


export default function Login({ onLogin, showToast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true);

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const res = await api.post(
      isLogin ? "/api/login" : "/api/register",
      {
        email,
        password,
        ...(isLogin ? {} : { name }),
      }
    );

    const data = res.data;

    localStorage.setItem("mediscan_token", data.token);
    localStorage.setItem("mediscan_user", JSON.stringify(data.user));

    if (isLogin) {
  // LOGIN FLOW
  localStorage.setItem("mediscan_token", data.token);
  localStorage.setItem("mediscan_user", JSON.stringify(data.user));

  onLogin(data.token, data.user);

  showToast("Login successful!", "success");
} else {
  // REGISTER FLOW
  showToast("Account created! Please login.", "success");

  setIsLogin(true); // 🔥 switch to login
  setName("");
  setPassword("");
}
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.root}>
      <div style={styles.background}>
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />
        <div style={styles.bgDots} />
      </div>

      <div style={styles.leftPanel}>
        <div style={styles.brandBlock}>
          <div style={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="white" fillOpacity="0.15"/>
              <path d="M14 6v16M6 14h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>MediScan AI</span>
        </div>
        <div style={styles.leftContent}>
          <h1 style={styles.leftHeading}>Intelligent Medical<br />Report Analysis</h1>
          <p style={styles.leftSubtitle}>Upload your medical reports and get instant AI-powered insights, condition detection, and clinical summaries.</p>
          <div style={styles.featureList}>
            {[
              { icon: '🔬', text: 'AI-powered condition detection' },
              { icon: '📋', text: 'Automated clinical summaries' },
              { icon: '🔒', text: 'Secure & HIPAA-compliant storage' },
              { icon: '⚡', text: 'Results in under 60 seconds' },
            ].map((f, i) => (
              <div key={i} style={{ ...styles.featureItem, animationDelay: `${i * 0.1}s` }}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.leftFooter}>
          <div style={styles.statRow}>
            {[['10k+', 'Reports Analyzed'], ['99.2%', 'Accuracy'], ['< 60s', 'Processing']].map(([val, label]) => (
              <div key={label} style={styles.stat}>
                <div style={styles.statVal}>{val}</div>
                <div style={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card} className="animate-fade-in-scale">
          <div style={styles.cardHeader}>
            <div style={styles.mobileLogoRow}>
              <div style={{ ...styles.logoIcon, background: 'linear-gradient(135deg, #2563eb, #14b8a6)', width: 36, height: 36 }}>
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M14 6v16M6 14h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--blue-600)', fontWeight: 600 }}>MediScan AI</span>
            </div>
           <h2 style={styles.cardTitle}>
           {isLogin ? "Sign in to your account" : "Create your account"}
           </h2>
            <p style={styles.cardSub}>Access your medical report dashboard</p>
          </div>

          <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
          >
          {isLogin ? "Register" : "Login"}
          </span>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {!isLogin && (
  <div style={styles.fieldGroup}>
    <label style={styles.label}>Full Name</label>
    <div style={styles.inputWrap}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={styles.input}
        disabled={loading}
      />
    </div>
  </div>
)}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-10 7L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  style={styles.input}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...styles.input, paddingRight: '44px' }}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox} className="animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
  {loading ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <span style={styles.btnSpinner} />
      {isLogin ? "Signing in..." : "Creating account..."}
    </span>
  ) : (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      {isLogin ? "Sign in" : "Register"}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </span>
  )}
</button>
          </form>

          <p style={styles.demoHint}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Use your registered credentials to sign in
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d5858 100%)',
  },
  bgCircle1: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
    top: -200,
    left: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
    bottom: -150,
    right: -100,
  },
  bgDots: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 48px',
    position: 'relative',
    zIndex: 1,
    color: 'white',
    '@media (max-width: 768px)': { display: 'none' },
  },
  brandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: 'white',
    letterSpacing: '-0.01em',
  },
  leftContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: 440,
  },
  leftHeading: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.6rem',
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'white',
    marginBottom: 20,
    letterSpacing: '-0.02em',
  },
  leftSubtitle: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    marginBottom: 36,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    animation: 'fadeIn 0.5s ease both',
  },
  featureIcon: {
    fontSize: '1.2rem',
    width: 36,
    height: 36,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.95rem',
  },
  leftFooter: {
    paddingTop: 32,
    borderTop: '1px solid rgba(255,255,255,0.15)',
  },
  statRow: {
    display: 'flex',
    gap: 32,
  },
  stat: { textAlign: 'left' },
  statVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'white',
  },
  statLabel: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: 2,
  },
  rightPanel: {
    width: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    width: '100%',
    background: 'white',
    borderRadius: 24,
    padding: '40px 36px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  cardHeader: {
    marginBottom: 32,
  },
  mobileLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 600,
    color: 'var(--gray-900)',
    marginBottom: 6,
    letterSpacing: '-0.02em',
  },
  cardSub: {
    fontSize: '0.9rem',
    color: 'var(--gray-500)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--gray-700)',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: 'var(--gray-400)',
    display: 'flex',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '11px 14px 11px 42px',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: '0.9rem',
    color: 'var(--gray-800)',
    background: 'var(--bg)',
    transition: 'var(--transition)',
    ':focus': {
      borderColor: 'var(--blue-500)',
      background: 'white',
    }
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    color: 'var(--gray-400)',
    display: 'flex',
    padding: 4,
    borderRadius: 4,
    transition: 'var(--transition)',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: 'var(--red-100)',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    color: 'var(--red-600)',
    fontSize: '0.85rem',
  },
  submitBtn: {
    padding: '13px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    borderRadius: 10,
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'var(--transition)',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
    marginTop: 4,
  },
  btnSpinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  demoHint: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    fontSize: '0.8rem',
    color: 'var(--gray-400)',
  },
}
