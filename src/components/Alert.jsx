import React, { useEffect } from 'react'
import '../css/Alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function Alert({ alert, setAlert }) {
  // ESC key দিয়ে close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setAlert(null);
      }
      if (e.key === 'Enter') {
        setAlert(null);
        alert?.onOk?.();
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setAlert, alert])

  if (!alert) return null

  const config = {
    success: {
      label: 'Successful',
      icon: faCircleCheck,
      color: '#1D9E75',
      bg: 'rgba(29, 158, 117, 0.15)',
      btnColor: '#1D9E75',
    },
    error: {
      label: 'Error',
      icon: faCircleXmark,
      color: '#E24B4A',
      bg: 'rgba(226, 75, 74, 0.15)',
      btnColor: '#E24B4A',
    },
    warning: {
      label: 'Warning',
      icon: faTriangleExclamation,
      color: '#BA7517',
      bg: 'rgba(186, 117, 23, 0.15)',
      btnColor: '#BA7517',
    },
    info: {
      label: 'Info',
      icon: faCircleInfo,
      color: '#8682fa',
      bg: 'rgba(134, 130, 250, 0.15)',
      btnColor: '#8682fa',
    },
  }

  const { label, icon, color, bg, btnColor } = config[alert.type] || config.info

  return (
    <>

      {/* Overlay */}
      <div
        onClick={() => setAlert(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'wmxOverlayFade 0.15s ease',
        }}
      >
        {/* Modal box — stop click propagation */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '360px',
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            animation: 'wmxModalPop 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Top section */}
          <div style={{ padding: '28px 28px 20px', textAlign: 'center' }}>
            {/* Icon circle */}
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <FontAwesomeIcon icon={icon} style={{ fontSize: '36px', color }} />
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '17px',
              color: '#f0f0f0',
              marginBottom: '8px',
            }}>
              {alert.title || label}
            </div>

            {/* Message */}
            <div style={{
              fontSize: '13.5px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
            }}>
              {alert.msg}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Footer buttons */}
          <div style={{
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}>
            <button
              onClick={() => setAlert(null)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13.5px',
                fontWeight: 500,
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => { setAlert(null); alert.onOk?.(); }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13.5px',
                fontWeight: 500,
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: btnColor,
                color: '#fff',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Alert