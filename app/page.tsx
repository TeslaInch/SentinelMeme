'use client';

import { useState, useEffect } from 'react';
import TokenCard from '@/components/TokenCard';
import { RiskReport } from '@/lib/types';

export default function Home() {
  const [address, setAddress] = useState('');
  const [report, setReport] = useState<RiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [telegramActive, setTelegramActive] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setTelegramActive(d.telegramActive ?? false))
      .catch(() => {})
  }, []);

  const handleScan = async () => {
    if (loading) return
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (response.status === 429) {
        setError('⏱ Too many scans. Please wait 60 seconds and try again.')
        setLoading(false)
        return
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setReport(data);
    } catch (err: any) {
      if (err.message && err.message.includes('fetch failed')) {
        setError('Network error — make sure the dev server is running');
      } else {
        setError(err.message || 'Failed to scan token');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setError(null);
    setReport({
      tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
      tokenName: 'SafeMoon Inu',
      tokenSymbol: 'SMINU',
      riskScore: 91,
      verdict: 'CRITICAL',
      redFlags: [
        'Single wallet controls 84% of supply',
        'Liquidity is NOT locked — developer can rug at any time',
        'Contract source code is NOT verified on BSCScan',
        'Token is less than 1 hour old',
      ],
      greenFlags: [],
      summary: 'This token exhibits multiple characteristics consistent with a rug pull setup. Exercise extreme caution — do not invest.',
      scannedAt: Date.now(),
      rawData: {
        token: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: 'SafeMoon Inu',
          symbol: 'SMINU',
          totalSupply: '1000000000',
          deployedAt: Math.floor(Date.now() / 1000) - 1800,
          contractVerified: false,
        },
        holders: {
          totalHolders: 12,
          top10HoldersPercent: 97,
          largestHolderPercent: 84,
        },
        liquidity: {
          hasLiquidity: true,
          liquidityUSD: 450,
          isLiquidityLocked: false,
        },
      },
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP NAV BAR */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.svg" width={32} height={32} style={{ borderRadius: '6px' }} />
          <span
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: '800',
              fontSize: '16px',
              letterSpacing: '4px',
              color: 'var(--text-primary)',
            }}
          >
            SENTINEL
          </span>
          <span
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: '800',
              fontSize: '16px',
              color: 'var(--accent)',
            }}
          >
            MEME
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)' }} />
            <span style={{ color: 'var(--text-primary)' }}>NETWORK: BSC MAINNET</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)' }} />
            <span style={{ color: 'var(--text-primary)' }}>AI ENGINE: ONLINE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)' }}>UNIBASE: SYNCED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: telegramActive ? 'var(--safe)' : 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-primary)' }}>{telegramActive ? 'ALERTS: ON' : 'ALERTS: OFF'}</span>
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '1px',
          }}
        >
          FOUR.MEME AI SPRINT 2026
        </div>
      </div>

      {/* STATS BAR */}
      <div
        style={{
          marginTop: '52px',
          height: '44px',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 48px', borderRight: '1px solid var(--border)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            247
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            TOKENS SCANNED
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 48px', borderRight: '1px solid var(--border)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            31
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            RUGS CAUGHT
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 48px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            216
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '2px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            CONFIRMED SAFE
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION BANNER */}
      <div
        style={{
          background: 'var(--accent-dim)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--accent)',
          }}
        >
          📨 Get real-time rug pull alerts on Telegram
        </div>
        <a
          href="https://t.me/SentinelMemeAlerts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--accent)',
            color: '#000',
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '4px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          JOIN CHANNEL →
        </a>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero text block */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '11px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}
          >
            REAL-TIME RUG PULL DETECTION
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '36px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              lineHeight: '1.15',
              marginBottom: '12px',
            }}
          >
            AI-Powered Token Risk Intelligence
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '15px',
              color: 'var(--text-secondary)',
            }}
          >
            Scan any BNB Chain token. Get an AI risk score in seconds. Know before you ape.
          </div>
        </div>

        {/* Scan Input Panel */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '32px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '12px',
            }}
          >
            TOKEN CONTRACT ADDRESS
          </div>
          <input
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={loading}
            style={{
              width: '100%',
              background: 'var(--bg-base)',
              border: inputFocused ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '6px',
              padding: '14px 16px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '14px',
              color: 'var(--text-primary)',
              boxShadow: inputFocused ? '0 0 0 3px var(--accent-dim)' : 'none',
            }}
          />

          {/* Button row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                color: loading ? 'var(--accent)' : '#000',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: '6px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'SCANNING...' : 'SCAN TOKEN'}
            </button>
            <button
              onClick={handleLoadDemo}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = 'var(--border-active)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              LOAD DEMO
            </button>
            <button
              onClick={() => setMonitoring(!monitoring)}
              disabled={loading}
              style={{
                background: 'transparent',
                border: monitoring ? '1px solid var(--safe)' : '1px solid var(--border)',
                color: monitoring ? 'var(--safe)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '12px 28px',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {monitoring ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}>◈</span>
                  MONITORING LIVE
                </span>
              ) : (
                '⬡ START MONITOR'
              )}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  background: 'var(--bg-elevated)',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: 'var(--accent)',
                    animation: 'scanProgress 2.5s linear infinite',
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  letterSpacing: '1px',
                }}
              >
                ANALYZING CONTRACT · FETCHING HOLDERS · RUNNING AI MODEL
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              style={{
                background: 'var(--danger-dim)',
                border: '1px solid var(--danger)',
                borderRadius: '6px',
                padding: '12px 16px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: 'var(--danger)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                ⚠ SCAN ERROR
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Results area */}
        {report && <div style={{ marginTop: '32px' }}><TokenCard report={report} /></div>}
      </div>

      {/* PAGE FOOTER */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 0',
          marginTop: '64px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          SENTINELMEME · BUILT FOR FOUR.MEME AI SPRINT 2026 · POWERED BY BNB CHAIN
        </div>
      </div>
    </div>
  );
}
