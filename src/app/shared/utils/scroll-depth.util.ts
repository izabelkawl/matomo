export const getScrollDepth = (): number => {
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;
  const maxScroll = Math.max(fullHeight - viewportHeight, 1);
  return Math.min(100, Math.round((scrollTop / maxScroll) * 100));
};
