import React, { useRef, useEffect, useState } from 'react';

interface PageTransitionProps {
  transitionKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ transitionKey, children }) => {
  const prevKeyRef = useRef<string>(transitionKey);
  const [animationClass, setAnimationClass] = useState<string>('animate-slide-in-right');

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== transitionKey) {
      // If going to 'home' or closing an editor, slide in from left; otherwise slide in from right
      if (transitionKey === 'home' || (prevKey.includes('-editor') && !transitionKey.includes('-editor'))) {
        setAnimationClass('animate-slide-in-left');
      } else {
        setAnimationClass('animate-slide-in-right');
      }
      prevKeyRef.current = transitionKey;
    }
  }, [transitionKey]);

  return (
    <div
      key={transitionKey}
      className={`w-full h-full flex-1 flex flex-col ${animationClass}`}
    >
      {children}
    </div>
  );
};
