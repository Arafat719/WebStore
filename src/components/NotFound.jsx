import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
            padding: '24px',
        }}>
            <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>

                {/* Glow orb */}
                <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '32px',
                }}>
                    <div style={{
                        width: '120px', height: '120px',
                        borderRadius: '28px',
                        background: 'linear-gradient(135deg, rgba(134,130,250,0.15), rgba(95,91,199,0.08))',
                        border: '1px solid rgba(134,130,250,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 0 60px rgba(134,130,250,0.15)',
                    }}>
                        <SearchX size={48} color="#8682fa" strokeWidth={1.5} />
                    </div>
                </div>

                {/* 404 */}
                <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '6rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #8682fa, #5f5bc7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px',
                }}>
                    404
                </div>

                <h2 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: '#f2f2ff',
                    margin: '0 0 10px',
                }}>
                    Page Not Found
                </h2>

                <p style={{
                    color: '#3e3e52',
                    fontSize: '0.88rem',
                    lineHeight: 1.7,
                    margin: '0 0 8px',
                }}>
                    The page you're looking for doesn't exist.
                </p>

                {/* Show the bad route */}
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(134,130,250,0.07)',
                    border: '1px solid rgba(134,130,250,0.15)',
                    borderRadius: '8px',
                    padding: '5px 14px',
                    fontSize: '0.78rem',
                    color: '#6862c8',
                    fontFamily: 'monospace',
                    marginBottom: '36px',
                    wordBreak: 'break-all',
                }}>
                    {location.pathname}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '10px 20px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '11px',
                            color: '#9090b0',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f2f2ff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9090b0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                        <ArrowLeft size={15} /> Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #8682fa, #5f5bc7)',
                            border: 'none',
                            borderRadius: '11px',
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: '0 4px 18px rgba(134,130,250,0.35)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(134,130,250,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(134,130,250,0.35)'; }}
                    >
                        <Home size={15} /> Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
