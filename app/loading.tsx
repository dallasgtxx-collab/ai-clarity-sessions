export default function Loading() {
  return (
    <main className="loading-screen" aria-busy="true" aria-label="Loading AI Clarity Sessions">
      <div className="loading-brand"><span>AC</span><strong>AI Clarity Sessions</strong></div>
      <div className="loading-content">
        <div className="skeleton skeleton-pill" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-title short" />
        <div className="skeleton skeleton-copy" />
        <div className="skeleton skeleton-button" />
      </div>
    </main>
  );
}
