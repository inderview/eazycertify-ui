export const getDeviceFingerprint = (): string => {
  if (typeof window === 'undefined') return '';

  const getBrowserId = () => {
    let id = localStorage.getItem('device_fingerprint');
    if (!id) {
      // Generate a random ID if not exists
      id = crypto.randomUUID();
      localStorage.setItem('device_fingerprint', id);
    }
    return id;
  };

  const browserId = getBrowserId();
  const userAgent = window.navigator.userAgent;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Simple hash of the components
  // In a real app, use a proper hashing function or library
  // For this MVP, we'll just concatenate and use the persistent browser ID as the main anchor
  return `${browserId}|${userAgent}|${screenRes}|${timezone}`;
};
