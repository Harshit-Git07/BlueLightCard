'use client';
import { ClipboardCard } from '@/page-components/ClipbaordCard/ClipboardCard';
import { useContext, useEffect, useState, useRef } from 'react';
import { OfferData } from '@/page-components/ClipbaordCard/types/offerData';
import { decodeBase64 } from '@/utils/base64';
import amplitudeEvents from '@/utils/amplitude/events';
import { useSearchParams } from 'next/navigation';
import AmplitudeContext from '@/context/AmplitudeContext';
import { redirect } from '@/utils/redirect';
import { useRouter } from 'next/router';

export default function CopyCodePage() {
  const [copied, setCopied] = useState(false);
  const [buttonText, setButtonText] = useState('Copy and continue to website');
  const [error, setError] = useState(false);
  const params = useSearchParams();
  const amplitude = useContext(AmplitudeContext);
  const [data, setData] = useState<OfferData>({});
  const router = useRouter();
  const sentPageView = useRef(false);

  useEffect(() => {
    const userIdParam = params.get('userId');
    const amplitudeData = params.get('amplitudeData');

    if (userIdParam && amplitudeData) {
      const offerData: OfferData = JSON.parse(decodeBase64(amplitudeData));
      setData(offerData);

      if (amplitude && !sentPageView.current) {
        amplitude.setUserId(userIdParam);
        amplitude.trackEventAsync(amplitudeEvents.EMAIL_CODE_VIEWED, offerData);
        sentPageView.current = true;
      }
    }
  }, [amplitude, params]);

  const handleCopy = async () => {
    const code = params.get('code') ?? '';
    const redirectURL = params.get('redirect') ?? '';

    if (!code || !redirectURL) {
      setError(true);
      return;
    }

    try {
      const codeString = decodeBase64(code);
      await navigator.clipboard.writeText(codeString);
      if (amplitude) {
        amplitude.trackEventAsync(amplitudeEvents.EMAIL_CODE_CLICKED, data);
      }
      setCopied(true);
      setButtonText('Code copied!');

      await redirect(redirectURL, 1000, router);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen">
      <ClipboardCard
        handleCopy={handleCopy}
        copied={copied}
        error={error}
        buttonText={buttonText}
      ></ClipboardCard>
    </section>
  );
}
