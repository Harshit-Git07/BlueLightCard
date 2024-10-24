import React, { useState, useEffect } from 'react';

const DetectDevice = () => {
  const [deviceType, setDeviceType] = useState('unknown');

  useEffect(() => {
    const checkDevice = async () => {
      // Check screen width
      if (window.innerWidth <= 1024) {
        console.log('Mobile screen');

        // Check touch capability
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
          console.log('Touch detected');

          // User Agent string check
          const userAgent = navigator.userAgent.toLowerCase();
          const mobileKeywords = [
            'android',
            'webos',
            'iphone',
            'ipad',
            'ipod',
            'blackberry',
            'windows phone',
          ];

          if (mobileKeywords.some((keyword) => userAgent.includes(keyword))) {
            console.log('User agent keyword found');

            // Camera detection
            let hasCamera = false;
            let multipleCameras = false;
            if (navigator.mediaDevices?.enumerateDevices) {
              try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                hasCamera = videoDevices.length > 0;
                multipleCameras = videoDevices.length > 1;
                console.log('CAMERA DETECT:', { hasCamera, multipleCameras });
              } catch (err) {
                console.error('Error detecting camera:', err);
              }
            }

            // Orientation and aspect ratio
            const isPortrait = window.matchMedia('(orientation: portrait)').matches;
            const aspectRatio = window.screen.width / window.screen.height;

            if (isPortrait && aspectRatio < 0.75) {
              setDeviceType(hasCamera ? 'phone' : 'small tablet');
            } else if (aspectRatio >= 0.75 && aspectRatio <= 1.3) {
              setDeviceType('tablet');
            } else {
              setDeviceType(hasCamera ? 'laptop' : 'desktop');
            }
          } else {
            setDeviceType('desktop'); // Touch capable desktop
          }
        } else {
          setDeviceType('desktop'); // Small screen desktop
        }
      } else {
        setDeviceType('desktop'); // Large screen device
      }
    };

    // Initial check
    checkDevice();

    // Add event listeners
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return (
    <div>
      <h1>Device Detection</h1>
      <p>This device is detected as: {deviceType}</p>
    </div>
  );
};

export default DetectDevice;
