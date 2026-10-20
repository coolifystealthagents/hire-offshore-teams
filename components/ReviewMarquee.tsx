'use client';

import { useState } from 'react';
import reviews from '@/app/review-provenance.json';

function Cards({ hidden = false }: { hidden?: boolean }) {
  return <div className="review-set" aria-hidden={hidden || undefined}>
    {reviews.map((review) => <article className="review-card" key={`${hidden ? 'copy-' : ''}${review.id}`}>
      <span className="review-summary-label">Feedback summary</span>
      <h3>{review.headline}</h3>
      <p>{review.body}</p>
      <div className="review-attribution"><strong>{review.name}</strong><span>{review.detail}</span></div>
    </article>)}
  </div>;
}

export function ReviewMarquee() {
  const [paused, setPaused] = useState(false);
  return <section className="reviews" aria-labelledby="reviews-title">
    <div className="review-heading">
      <div>
        <h2 id="reviews-title">Client feedback summaries</h2>
        <p>Condensed from feedback published by StealthAgents; no rating is asserted.</p>
      </div>
      <div className="review-controls">
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? 'Resume reviews' : 'Pause reviews'}</button>
        <a href="https://stealthagents.com/" rel="noreferrer" target="_blank">Published feedback page</a>
      </div>
    </div>
    <div className="review-window">
      <div className={`review-track${paused ? ' is-paused' : ''}`}><Cards /><Cards hidden /></div>
    </div>
  </section>;
}
