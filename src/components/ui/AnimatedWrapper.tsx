'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '@/types';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps extends HTMLMotionProps<'div'> {
  variant?: 'fadeInUp' | 'scaleIn' | 'stagger' | 'none';
  delay?: number;
  duration?: number;
  viewport?: boolean;
}

const MotionDiv = motion.div;

const variants = {
  fadeInUp,
  scaleIn,
  stagger: staggerContainer,
  none: {
    initial: {},
    animate: {},
  },
};

export default function AnimatedWrapper({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  viewport = true,
  className,
  ...props
}: AnimatedWrapperProps) {
  const selectedVariant = variants[variant];

  return (
    <MotionDiv
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={viewport ? { once: true, margin: '-100px' } : false}
      variants={variant === 'stagger' ? selectedVariant : undefined}
      animate={variant !== 'stagger' ? 'animate' : undefined}
      transition={{
        duration,
        delay: variant === 'stagger' ? undefined : delay,
        ease: 'easeOut',
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionDiv>
  );
}

export { AnimatedWrapper as Motion };
