export default function ResultCard({ data }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a2e22', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>
          API Summary
        </span>
      </div>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Base URL</p>
          <code style={{
            display: 'block',
            fontSize: '0.72rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#c9a84c',
            backgroundColor: '#0b1610',
            padding: '0.4rem 0.6rem',
            border: '1px solid #1a2e22',
            borderRadius: '3px',
            wordBreak: 'break-all',
          }}>
            {data?.baseUrl || 'Not detected'}
          </code>
        </div>
        <div>
          <p style={{ fontSize: '0.65rem', color: '#666660', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Authentication</p>
          <span style={{
            display: 'inline-block',
            fontSize: '0.72rem',
            color: '#c9a84c',
            backgroundColor: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '2px',
            padding: '0.25rem 0.6rem',
            fontWeight: 500,
          }}>
            {data?.authentication || 'None specified'}
          </span>
        </div>
      </div>
    </div>
  );
}
