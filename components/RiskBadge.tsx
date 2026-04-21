import { RiskReport } from '@/lib/types';

interface RiskBadgeProps {
  verdict: RiskReport['verdict'];
  riskScore: number;
}

const VERDICT_CONFIG = {
  SAFE: {
    color: 'var(--safe)',
    bg: 'var(--safe-dim)',
    pulse: false,
  },
  CAUTION: {
    color: 'var(--warning)',
    bg: 'var(--warning-dim)',
    pulse: false,
  },
  DANGER: {
    color: 'var(--danger)',
    bg: 'var(--danger-dim)',
    pulse: false,
  },
  CRITICAL: {
    color: 'var(--danger)',
    bg: 'var(--danger-dim)',
    pulse: true,
  },
};

export default function RiskBadge({ verdict, riskScore }: RiskBadgeProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 14px 6px 0',
        paddingLeft: '12px',
        borderLeft: '3px solid ' + config.color,
        backgroundColor: config.bg,
        borderRadius: '4px',
        fontFamily: 'var(--font-syne), sans-serif',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontWeight: '700',
        color: config.color,
        boxShadow: config.pulse
          ? '0 0 20px rgba(248,81,73,0.5)'
          : '0 0 12px ' + config.color + '40',
        animation: config.pulse ? 'redPulse 2s ease-in-out infinite' : 'none',
      }}
    >
      <span>{verdict}</span>
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '13px',
        }}
      >
        · {riskScore} / 100
      </span>
    </div>
  );
}
