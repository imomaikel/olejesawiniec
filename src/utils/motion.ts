type TTransition = 'decay' | 'spring' | 'keyframes' | 'tween' | 'inertia';

export const staggerContainer = (delay: number = 0.25) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
    },
  },
});

export const zoomOut = (delay: number, duration: number) => ({
  hidden: {
    scale: 1.2,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'tween',
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});

export const itemSlide = (y: number, x: number) => {
  return {
    hidden: { opacity: 0, y, x },
    show: { opacity: 1, y: 0, x: 0 },
  };
};

export const slideIn = (
  direction: 'top' | 'right' | 'bottom' | 'left',
  type: TTransition,
  delay: number,
  duration: number,
  value?: number | 'total',
) => ({
  hidden: {
    x: direction === 'right' ? `${value ?? `100%`}` : direction === 'left' ? `${value ?? `-100%`}` : 0,
    y: direction === 'top' ? `${value ?? `100%`}` : direction === 'bottom' ? `${value ?? `-100%`}` : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});

export const opacity = {
  hidden: {
    opacity: [1, 0],
    display: ['none'],
    transition: {
      duration: 1,
    },
  },
  show: {
    display: 'block',
    opacity: [0, 1],
    transition: {
      duration: 0.5,
    },
  },
};
