'use client';
import { ClipboardCard } from '@/root/src/page-components/ClipboardCard/ClipboardCard';
import { useContext, useEffect, useState, useRef } from 'react';
import { OfferData } from '@core/types/offerdata';
import { decodeBase64 } from '@/utils/base64';
import amplitudeEvents from '@/utils/amplitude/events';
import { useSearchParams } from 'next/navigation';
import AmplitudeContext from '@/context/AmplitudeContext';
import { redirectAndDecodeURL } from '@/utils/redirectAndDecode';
import { useRouter } from 'next/router';
import BlcLogo from '../../assets/BLC-landscape.svg';
export default function CopyCodePage() {
  const [copied, setCopied] = useState(false);
  const [buttonText, setButtonText] = useState('Copy and continue to website');
  const [error, setError] = useState(false);
  const params = useSearchParams();
  const amplitude = useContext(AmplitudeContext);
  const [data, setData] = useState<OfferData | null>();
  const router = useRouter();
  const sentPageView = useRef(false);

  useEffect(() => {
    const amplitudeData = params.get('metaData');

    if (amplitudeData) {
      const offerData: OfferData = JSON.parse(decodeBase64(amplitudeData));
      setData(offerData);

      if (amplitude && !sentPageView.current) {
        amplitude.setUserId(offerData.userUID);
        amplitude.trackEventAsync(amplitudeEvents.EMAIL_CODE_VIEWED, offerData);
        sentPageView.current = true;
      }
    }
  }, [amplitude, params]);

  const handleCopy = async () => {
    const code = params.get('code') ?? '';
    const redirectURLBase64 = params.get('redirect') ?? '';

    if (!code || !redirectURLBase64) {
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

      await redirectAndDecodeURL(redirectURLBase64, 1000, router);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <BlcLogo></BlcLogo>
      <ClipboardCard
        handleCopy={handleCopy}
        copied={copied}
        error={error}
        buttonText={buttonText}
      ></ClipboardCard>
    </section>
  );
}
