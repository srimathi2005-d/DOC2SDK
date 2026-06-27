// Compute complexity scores deterministically from existing apiData
function computeScores(apiData, generationData) {
  const endpoints = apiData?.endpoints || [];
  const auth      = (apiData?.authentication || '').toLowerCase();
  const sdk       = generationData?.sdkRecommendation;
  const n         = endpoints.length;

  const authDifficulty =
    auth.includes('oauth')                          ? 82 :
    auth.includes('bearer') || auth.includes('jwt') ? 62 :
    auth.includes('api key') || auth.includes('apikey') || auth.includes('api_key') ? 42 :
    auth.includes('basic')                          ? 50 :
    auth.includes('none') || auth === ''            ? 18 : 45;

  const complexityRaw = Math.min(95, 20 + n * 5);

  const devHours = Math.max(1, Math.round(n * 0.75 + authDifficulty / 25));

  const hasDescriptions = endpoints.some(e => e.description && e.description.length > 8);
  const docQuality = Math.min(90, hasDescriptions ? 72 : 48);

  const sdkAvailability = sdk?.exists ? 88 : 28;

  const apiCoverage = Math.min(92, 25 + n * 6);

  const errorHandling = authDifficulty > 40 ? 68 : 44;

  const devFriendliness = Math.round((docQuality + (100 - authDifficulty * 0.4) + apiCoverage) / 3);

  return {
    integrationComplexity: complexityRaw,
    authDifficulty,
    devHours,
    docQuality,
    sdkAvailability,
    apiCoverage,
    errorHandling,
    devFriendliness: Math.min(90, devFriendliness),
  };
}

function getLabel(score) {
  if (score >= 75) return { text: 'High',   color: '#f87171' };
  if (score >= 45) return { text: 'Medium', color: '#fb923c' };
  return              { text: 'Low',    color: '#4ade80' };
}

function CircleScore({ score, size = 64 }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const lbl = getLabel(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2e22" strokeWidth="5" />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={lbl.color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '0.75rem', fontWeight: 700, color: lbl.color,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        {score}
      </span>
    </div>
  );
}

function BarScore({ label, score, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: '#b0a898' }}>{label}</span>
        <span style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color }}>{score}%</span>
      </div>
      <div style={{ height: '4px', background: '#1a2e22', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`, background: color,
          borderRadius: '2px', transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

function MetricCard({ title, score, subtitle }) {
  const lbl = getLabel(score);
  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <CircleScore score={score} size={56} />
      <div>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ede5d0', marginBottom: '0.2rem' }}>{title}</p>
        <span style={{
          fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0.1rem 0.4rem', borderRadius: '2px',
          background: `${lbl.color}18`, color: lbl.color, border: `1px solid ${lbl.color}30`,
        }}>{lbl.text}</span>
        {subtitle && <p style={{ fontSize: '0.68rem', color: '#666660', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ComplexityDashboard({ apiData, generationData }) {
  const s = computeScores(apiData, generationData);
  const auth = apiData?.authentication || 'Not specified';
  const endpoints = apiData?.endpoints || [];

  const risks = [
    endpoints.length > 15 && 'High endpoint count may require pagination handling',
    s.authDifficulty > 60  && 'Complex authentication flow — OAuth token refresh required',
    !generationData?.sdkRecommendation?.exists && 'No official SDK — custom wrapper maintenance required',
    s.docQuality < 55      && 'Documentation quality may lead to incomplete integration',
  ].filter(Boolean);

  const recommendations = [
    'Cache authentication tokens to minimize API round-trips',
    'Implement exponential backoff for rate-limited endpoints',
    'Use environment variables for all credentials — never hardcode',
    endpoints.length > 0 && `Start with the primary endpoint: ${endpoints[0]?.method || 'GET'} ${endpoints[0]?.path || '/'}`,
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Overview header */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666660', marginBottom: '0.2rem' }}>Integration Report</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ede5d0' }}>
            {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} · {auth} auth · Est. {s.devHours}h dev time
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Analysis Complete', 'SDK Scanned', 'Guide Generated'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em',
              padding: '0.2rem 0.5rem', borderRadius: '2px',
              background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)',
            }}>✓ {tag}</span>
          ))}
        </div>
      </div>

      {/* Primary metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        <MetricCard title="Integration Complexity"  score={s.integrationComplexity} subtitle={`${endpoints.length} endpoints detected`} />
        <MetricCard title="Auth Difficulty"         score={s.authDifficulty}        subtitle={auth} />
        <MetricCard title="Documentation Quality"   score={s.docQuality}            subtitle="Based on endpoint descriptions" />
        <MetricCard title="Developer Friendliness"  score={s.devFriendliness}       subtitle="Composite score" />
      </div>

      {/* Progress bars */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898', marginBottom: '1rem' }}>
          Detailed Metrics
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <BarScore label="SDK Availability"   score={s.sdkAvailability}  color="#c9a84c" />
          <BarScore label="API Coverage"        score={s.apiCoverage}      color="#60a5fa" />
          <BarScore label="Error Handling"      score={s.errorHandling}    color="#fb923c" />
          <BarScore label="Dev Friendliness"    score={s.devFriendliness}  color="#4ade80" />
        </div>
      </div>

      {/* Estimated Dev Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Estimated Dev Time</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', lineHeight: 1 }}>
            {s.devHours}h
          </p>
          <p style={{ fontSize: '0.7rem', color: '#8a8a80', marginTop: '0.3rem' }}>without Doc2SDK</p>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem', background: 'rgba(34,197,94,0.04)', borderColor: 'rgba(34,197,94,0.15)' }}>
          <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>With Doc2SDK</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#4ade80', lineHeight: 1 }}>
            ~2m
          </p>
          <p style={{ fontSize: '0.7rem', color: '#8a8a80', marginTop: '0.3rem' }}>AI-powered generation</p>
        </div>
      </div>

      {/* Risks */}
      {risks.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'rgba(251,146,60,0.2)' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fb923c', marginBottom: '0.875rem' }}>
            ⚠ Potential Risks
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {risks.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#fb923c', fontSize: '0.7rem', marginTop: '0.1rem', flexShrink: 0 }}>›</span>
                <p style={{ fontSize: '0.75rem', color: '#b0a898', lineHeight: 1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '0.875rem' }}>
          ✓ AI Recommendations
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#4ade80', fontSize: '0.7rem', marginTop: '0.1rem', flexShrink: 0 }}>✓</span>
              <p style={{ fontSize: '0.75rem', color: '#b0a898', lineHeight: 1.6 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
