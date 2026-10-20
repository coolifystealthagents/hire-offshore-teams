import reviews from '@/app/review-provenance.json';

function Cards({ hidden = false }: { hidden?: boolean }) {
  return <div className="review-set" aria-hidden={hidden || undefined}>
    {reviews.map((review) => <article className="review-card" key={`${hidden ? 'copy-' : ''}${review.id}`}>
      <div className="review-stars" aria-label="Five star review">★★★★★</div>
      <h3>{review.headline}</h3>
      <p>{review.body}</p>
      <div className="review-attribution"><strong>{review.name}</strong><span>{review.detail}</span></div>
    </article>)}
  </div>;
}

export function ReviewMarquee() {
  return <section className="reviews" aria-labelledby="reviews-title">
    <div className="review-heading">
      <div>
        <h2 id="reviews-title">StealthAgents reviews</h2>
        <p>Approved client feedback published by StealthAgents.</p>
      </div>
      <a href="https://stealthagents.com/" rel="noreferrer" target="_blank">Published feedback page</a>
    </div>
    <div className="review-window">
      <div className="review-track" tabIndex={0} aria-label="Automatically moving StealthAgents reviews. Focus or hover to pause."><Cards /><Cards hidden /></div>
    </div>
  </section>;
}
