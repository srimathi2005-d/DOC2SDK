const METHOD_STYLES = {
  GET:    'badge-get',
  POST:   'badge-post',
  PUT:    'badge-put',
  PATCH:  'badge-patch',
  DELETE: 'badge-delete',
};

export default function EndpointTable({ endpoints }) {
  if (!endpoints?.length) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#666660', padding: '1rem 0' }}>No endpoints detected</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1a2e22', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0a898' }}>
          Endpoints
        </span>
        <span style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: '#c9a84c', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.15rem 0.5rem', borderRadius: '2px' }}>
          {endpoints.length}
        </span>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: '260px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a2e22' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: '#666660', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', width: '72px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: '#666660', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Path</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: '#666660', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="hidden sm:table-cell">Description</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep, idx) => {
              const m = ep.method?.toUpperCase();
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #1a2e22' }}>
                  <td style={{ padding: '0.6rem 1rem' }}>
                    <span className={`${METHOD_STYLES[m] || 'badge-default'}`}
                      style={{ fontSize: '0.6rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
                      {m}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 1rem' }}>
                    <code style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: '#ede5d0' }}>{ep.path}</code>
                  </td>
                  <td style={{ padding: '0.6rem 1rem', color: '#8a8a80', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hidden sm:table-cell">
                    {ep.purpose}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
