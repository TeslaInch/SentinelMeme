import { useState } from 'react';
import { RiskReport } from '@/lib/types';
import RiskBadge from './RiskBadge';

interface TokenCardProps {
  report: RiskReport;
}

export default function TokenCard({ report }: TokenCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(report.tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = () => {
    if (report.riskScore >= 75) return 'var(--danger)';
    if (report.riskScore >= 50) return 'var(--warning)';
    return 'var(--safe)';
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        animation: 'fadeInUp 0.35s ease forwards',
        boxShadow: '0 0 0 1px var(--border), 0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Card Header Bar */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F85149' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E3B341' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3FB950' }} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          /sentinel/scan/result
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {new Date(report.scannedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Token Identity Row */}
      <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--text-primary)',
            }}
          >
            {report.tokenName}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '13px',
              color: 'var(--accent)',
              letterSpacing: '2px',
              marginTop: '4px',
            }}
          >
            ${report.tokenSymbol}
          </div>
        </div>
        <RiskBadge verdict={report.verdict} riskScore={report.riskScore} />
      </div>

      {/* Address Row */}
      <div style={{ padding: '0 24px 16px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          CONTRACT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            {report.tokenAddress}
          </div>
          <button
            onClick={copyAddress}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text-muted)',
              padding: 0,
            }}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {/* Risk Score Visualization */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          THREAT INDEX
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: 'var(--bg-elevated)',
                height: '6px',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${report.riskScore}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--safe) 0%, var(--warning) 50%, var(--danger) 100%)',
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '28px',
              fontWeight: '700',
              color: getScoreColor(),
              minWidth: '80px',
              textAlign: 'right',
            }}
          >
            {report.riskScore}
          </div>
        </div>
      </div>

      {/* On-Chain Attestation Section */}
      {(report.verdict === 'DANGER' || report.verdict === 'CRITICAL') && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          borderLeft: '3px solid var(--accent)',
        }}>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '3px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            ⛓ ON-CHAIN ATTESTATION
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              marginBottom: '8px',
            }}
          >
            {report.existingAttestation ? (
              <span style={{ color: 'var(--warning)' }}>
                ⚠ Previously attested on {new Date(report.existingAttestation.timestamp).toLocaleDateString()} — Risk Score: {report.existingAttestation.riskScore}/100
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>
                ◈ Writing risk verdict to BNB Chain...
              </span>
            )}
          </div>
          <a
            href={`https://testnet.bscscan.com/address/${process.env.NEXT_PUBLIC_ATTESTATION_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '11px',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            View contract on BSCScan Testnet →
          </a>
        </div>
      )}

      {/* Red Flags Section */}
      {report.redFlags.length > 0 && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '9px',
                letterSpacing: '3px',
                color: 'var(--danger)',
                textTransform: 'uppercase',
              }}
            >
              ⬡ THREAT INDICATORS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: 'var(--danger)',
              }}
            >
              [{report.redFlags.length}]
            </div>
          </div>
          {report.redFlags.map((flag, index) => (
            <div key={index}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0' }}>
                <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono), monospace' }}>—</span>
                <span
                  style={{
                    fontFamily: 'var(--font-syne), sans-serif',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    flex: 1,
                  }}
                >
                  {flag}
                </span>
              </div>
              {index < report.redFlags.length - 1 && (
                <div style={{ height: '1px', background: 'var(--border)', opacity: 0.2 }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Green Flags Section */}
      {report.greenFlags.length > 0 && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '9px',
              letterSpacing: '3px',
              color: 'var(--safe)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            ⬡ POSITIVE SIGNALS
          </div>
          {report.greenFlags.map((flag, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 0' }}>
              <span style={{ color: 'var(--safe)', fontFamily: 'var(--font-mono), monospace' }}>—</span>
              <span
                style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  flex: 1,
                }}
              >
                {flag}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Row */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          AI ASSESSMENT
        </div>
        <div
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '13px',
            lineHeight: '1.7',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
          }}
        >
          {report.summary}
        </div>
      </div>

      {/* Telegram Alert Callout */}
      {(report.verdict === 'DANGER' || report.verdict === 'CRITICAL') && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '10px 24px',
          background: report.verdict === 'CRITICAL'
            ? 'var(--danger-dim)'
            : 'var(--warning-dim)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '14px' }}>📨</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: report.verdict === 'CRITICAL'
              ? 'var(--danger)'
              : 'var(--warning)',
            letterSpacing: '0.5px',
          }}>
            TELEGRAM ALERT DISPATCHED · Subscribers notified
          </span>
        </div>
      )}

      {/* Unibase Memory Footer */}
      <div
        style={{
          padding: '12px 24px',
          background: 'var(--accent-dim)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '11px',
          color: 'var(--accent)',
          letterSpacing: '0.5px',
        }}
      >
        ◈ Pattern logged to Unibase AI memory layer · Cross-session learning active
      </div>
    </div>
  );
}
