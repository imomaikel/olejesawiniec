'use client';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { slideIn } from '@/utils/motion';
import { motion } from 'framer-motion';

type TProviders = {
  redirectTo: string | null;
};
const Providers = ({ redirectTo }: TProviders) => {
  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-center">
        <div className="w-full h-[1px] bg-gray-200" />
        <div className="absolute bg-white px-3 text-sm text-muted-foreground">albo za pomocą</div>
      </div>
      <div className="mt-6 flex w-full items-center justify-center gap-x-4">
        <motion.div
          initial="hidden"
          animate="show"
          variants={slideIn('bottom', 'spring', 0, 0.4, 20)}
          viewport={{ once: false }}
          role="button"
          aria-label="google login"
          className="group"
          onClick={() =>
            signIn('google', {
              callbackUrl: redirectTo ?? '/sklep',
            })
          }
        >
          <FaGoogle className="w-8 h-8 group-hover:text-primary transition-colors" />
        </motion.div>
        {/* <motion.div
          initial="hidden"
          animate="show"
          variants={slideIn('bottom', 'spring', 0.1, 0.4, 20)}
          viewport={{ once: false }}
          role="button"
          aria-label="apple login"
          className="group"
          onClick={() =>
            signIn('apple', {
              callbackUrl: redirectTo ?? '/sklep',
            })
          }
        >
          <FaApple className="w-8 h-8 group-hover:text-primary transition-colors" />
        </motion.div> */}
        {/* <motion.div
          initial="hidden"
          animate="show"
          variants={slideIn('bottom', 'spring', 0.2, 0.4, 20)}
          viewport={{ once: false }}
          role="button"
          aria-label="facebook login"
          className="group"
          onClick={() =>
            signIn('facebook', {
              callbackUrl: redirectTo ?? '/sklep',
            })
          }
        >
          <FaFacebook className="w-8 h-8 group-hover:text-primary transition-colors" />
        </motion.div> */}
      </div>
    </div>
  );
};

export default Providers;
