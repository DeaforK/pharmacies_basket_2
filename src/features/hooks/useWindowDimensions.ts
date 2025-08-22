import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  const changeResize = useDebounce(handleResize,500)

  useEffect(() => {
    window.addEventListener('resize', changeResize);
    return () => window.removeEventListener('resize', changeResize);
  }, []);

  return windowDimensions;
}