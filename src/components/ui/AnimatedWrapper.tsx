'use client';

import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '@/types';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps extends HTMLMotionProps<'div'> {
  variant?: 'fadeInUp' | 'scaleIn' | 'stagger' | 'none';
  delay?: number;
  duration?: number;
  useViewport?: boolean;
}

const MotionDiv = motion.div;

const variants: Record<'fadeInUp' | 'scaleIn' | 'stagger' | 'none', Variants> = {
  fadeInUp: fadeInUp as unknown as Variants,
  scaleIn: scaleIn as unknown as Variants,
  stagger: staggerContainer as unknown as Variants,
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
  useViewport = true,
  className,
  ...props
}: AnimatedWrapperProps) {
  const selectedVariant = variants[variant];

  return (
    <MotionDiv
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={useViewport ? { once: true, margin: '-100px' } : undefined}
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
