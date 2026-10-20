'use client';
import { KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const personalDomains = new Set(['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','aol.com','proton.me','protonmail.com']);

export function LeadForm({ source = 'contact-page-consultation' }: { source?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(form: HTMLFormElement) {
    if (busy || !form.reportValidity()) return;
    setBusy(true);
    setError('');
    const data = new FormData(form);
    const domain = String(data.get('email') || '').trim().toLowerCase().split('@')[1];
    if (!domain || personalDomains.has(domain)) {
      setError('Please use your business email address.');
      setBusy(false);
      return;
    }
    data.set('source', source);
    data.set('_page_url', location.href);
    try {
      const response = await fetch('/api/submit-lead', { method: 'POST', body: data });
      const result = await response.json();
      if (result.ignored) {
        setError('Your request was ignored. Please refresh and try again.');
        setBusy(false);
        return;
      }
      if (!response.ok || !result.ok || !result.delivered) {
        setError(result.message || 'We could not send your request. Please try again.');
        setBusy(false);
        return;
      }
      const payload = Object.fromEntries(data.entries());
      delete payload.website_url;
      try { window.acrTracker?.trackLead({ ...payload, source }); } catch { /* Delivery is already confirmed. */ }
      router.push('/thank-you');
    } catch {
      setError('We could not send your request. Please try again.');
      setBusy(false);
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    void submit(event.currentTarget);
  }

  return <form className="lead-form" onKeyDown={handleEnter} noValidate>
    <label>First name <span aria-hidden="true">*</span><input name="first_name" maxLength={80} autoComplete="given-name" required /></label>
    <label>Last name <span aria-hidden="true">*</span><input name="last_name" maxLength={80} autoComplete="family-name" required /></label>
    <label className="form-wide">Business email <span aria-hidden="true">*</span><input name="email" maxLength={254} type="email" autoComplete="email" required /></label>
    <label>Country code<select name="phone_country" defaultValue="+1"><option value="+1">US/CA +1</option><option value="+44">UK +44</option><option value="+61">AU +61</option><option value="+63">PH +63</option><option value="other">Other</option></select></label>
    <label>Phone number<input name="phone" maxLength={40} type="tel" autoComplete="tel-national" /></label>
    <label>Company <span aria-hidden="true">*</span><input name="company" maxLength={120} autoComplete="organization" required /></label>
    <label>Website / URL<input name="company_website" maxLength={200} type="url" autoComplete="url" placeholder="https://" /></label>
    <label>Company size <span aria-hidden="true">*</span><select name="company_size" required defaultValue=""><option value="" disabled>Select</option><option>1 to 10</option><option>11 to 50</option><option>51 to 200</option><option>201 to 500</option><option>501+</option></select></label>
    <label>Positions to fill <span aria-hidden="true">*</span><select name="positions_to_fill" required defaultValue=""><option value="" disabled>Select</option><option>1</option><option>2 to 3</option><option>4 to 10</option><option>11+</option><option>Not sure yet</option></select></label>
    <label>How did you hear about us? <span aria-hidden="true">*</span><select name="referral_source" required defaultValue=""><option value="" disabled>Select</option><option>Search engine</option><option>Referral</option><option>Business network</option><option>Social media</option><option>Stealth Agents</option><option>Other</option></select></label>
    <label>Message<textarea name="message" maxLength={2000} rows={2} placeholder="Describe the workflow and support you need." /></label>
    <input type="hidden" name="source" value={source} />
    <label className="honeypot" aria-hidden="true">Website<input name="website_url" tabIndex={-1} autoComplete="off" /></label>
    {error && <p className="form-error form-wide" role="alert">{error}</p>}
    <button type="button" className="button primary form-wide" disabled={busy} onClick={(event) => event.currentTarget.form && void submit(event.currentTarget.form)}>{busy ? 'Sending...' : 'Book a Free Consultation'}</button>
  </form>;
}
