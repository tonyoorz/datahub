import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong';
  hover?: boolean;
}

export default function GlassCard({
  className,
  variant = 'default',
  hover = true,
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/80 backdrop-blur-md border-white/20',
    subtle: 'bg-white/60 backdrop-blur-sm border-white/10',
    strong: 'bg-white/90 backdrop-blur-lg border-white/30',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-sm',
        variants[variant],
        hover && 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
