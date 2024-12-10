import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      const isSmallScreen = window.matchMedia('(max-width: 1199px)').matches;

      return isMobileDevice || isSmallScreen;
    };

    setIsMobile(checkDevice());

    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const handleChange = () => {
      setIsMobile(checkDevice());
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
};
