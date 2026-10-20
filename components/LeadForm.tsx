'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
const personalDomains = new Set(['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','aol.com','proton.me','protonmail.com']);
export function LeadForm({ source = 'contact-page' }: { source?: string }) {
  const router = useRouter(); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) { event.preventDefault(); if(busy)return; setBusy(true); setError(''); const form=event.currentTarget; const data=new FormData(form); const domain=String(data.get('email')||'').trim().toLowerCase().split('@')[1]; if(!domain||personalDomains.has(domain)){setError('Please use your business email address.');setBusy(false);return} data.set('source',source); data.set('_page_url',location.href); try { const response=await fetch('/api/submit-lead',{method:'POST',body:data}); const result=await response.json(); if(result.ignored){setError('Your request was ignored. Please refresh and try again.');setBusy(false);return} if(!response.ok||!result.ok||!result.delivered){setError(result.message||'We could not send your request. Please try again.');setBusy(false);return} const payload=Object.fromEntries(data.entries()); delete payload.website_url; window.acrTracker?.trackLead({...payload,source}); router.push('/thank-you'); } catch { setError('We could not send your request. Please try again.');setBusy(false); } }
  return <form className="lead-form" onSubmit={submit} noValidate>
    <label>First name <span aria-hidden="true">*</span><input name="first_name" maxLength={80} autoComplete="given-name" required /></label>
    <label>Last name <span aria-hidden="true">*</span><input name="last_name" maxLength={80} autoComplete="family-name" required /></label>
    <label className="form-wide">Business email <span aria-hidden="true">*</span><input name="email" maxLength={254} type="email" autoComplete="email" required /></label>
    <label>Country code<select name="phone_country" defaultValue="+1"><option value="+1">US/CA +1</option><option value="+44">UK +44</option><option value="+61">AU +61</option><option value="+63">PH +63</option><option value="other">Other</option></select></label>
    <label>Phone number<input name="phone" maxLength={40} type="tel" autoComplete="tel-national" /></label>
    <label className="form-wide">Company <span aria-hidden="true">*</span><input name="company" maxLength={120} autoComplete="organization" required /></label>
    <label>Company size <span aria-hidden="true">*</span><select name="company_size" required defaultValue=""><option value="" disabled>Select</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201+</option></select></label>
    <label>Positions to fill <span aria-hidden="true">*</span><select name="positions_to_fill" required defaultValue=""><option value="" disabled>Select</option><option>1</option><option>2-5</option><option>6+</option></select></label>
    <label className="form-wide">How did you hear about us? <span aria-hidden="true">*</span><select name="referral_source" required defaultValue=""><option value="" disabled>Select</option><option>Search</option><option>Referral</option><option>Social media</option><option>Other</option></select></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website_url" tabIndex={-1} autoComplete="off" /></label>
    {error && <p className="form-error form-wide" role="alert">{error}</p>}<button className="button primary form-wide" disabled={busy}>{busy?'Sending...':'Request my consultation'}</button>
  </form>;
}
