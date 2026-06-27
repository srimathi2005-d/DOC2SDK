export default function Loader({ text = 'Loading...' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8a8a80', fontSize: '0.8rem' }}>
      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#c9a84c" strokeWidth="4" opacity="0.25"/>
        <path fill="#c9a84c" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
      </svg>
      {text}
    </span>
  );
}
