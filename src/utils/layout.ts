const updateViewportDimensions = () => {
  const vh = window.innerHeight * 0.01;
  const vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
};

export const setHorizontalLayout = (force: boolean = true) => {
  const shouldForceHorizontal = force && window.innerHeight < 480 && window.innerWidth < window.innerHeight;
  
  if (shouldForceHorizontal) {
    document.documentElement.classList.add('force-horizontal');
    document.body.classList.add('force-horizontal-active');
    updateViewportDimensions();
    window.addEventListener('resize', updateViewportDimensions);
    window.addEventListener('orientationchange', updateViewportDimensions);
  } else {
    document.documentElement.classList.remove('force-horizontal');
    document.body.classList.remove('force-horizontal-active');
    window.removeEventListener('resize', updateViewportDimensions);
    window.removeEventListener('orientationchange', updateViewportDimensions);
  }
  
  return shouldForceHorizontal;
};

export const toggleHorizontalLayout = () => {
  const isForced = document.documentElement.classList.contains('force-horizontal');
  return setHorizontalLayout(!isForced);
};