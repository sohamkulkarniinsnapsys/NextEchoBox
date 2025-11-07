'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string;
  wrapperClassName?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder.png',
  wrapperClassName = '',
  className = '',
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.8 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={hasError ? fallback : src}
          alt={alt}
          className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          {...props}
        />
      </motion.div>
    </div>
  );
}
