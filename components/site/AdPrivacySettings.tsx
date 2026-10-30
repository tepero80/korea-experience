'use client';
import { useEffect, useState } from 'react';
import config from '@/data/ad-config.json';
declare global {
  interface Window {
    googlefc?: {
      callbackQueue: Array<(() => void) | { CONSENT_API_READY: () => void }>;
      showRevocationMessage?: () => void;
    };
  }
}
export default function AdPrivacySettings() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (location.hostname !== 'koreaexperience.com' || !config.enabled || !config.cmpVerified)
      return;
    let active = true;
    window.googlefc ||= { callbackQueue: [] };
    window.googlefc.callbackQueue ||= [];
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => active && setReady(true) });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div id="advertising-choices">
      <button
        className="button button-light"
        disabled={!ready}
        onClick={() => {
          window.googlefc?.callbackQueue.push(() => window.googlefc?.showRevocationMessage?.());
        }}
      >
        Manage advertising privacy choices
      </button>
      <p className="small-note">
        Google offers the choices applicable to your region. If this control is unavailable, check
        your browser’s blocking settings or try again later. Reading and planning remain available.
      </p>
    </div>
  );
}
