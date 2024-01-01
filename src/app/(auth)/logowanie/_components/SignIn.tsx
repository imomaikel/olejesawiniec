'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Providers from './Providers';
import AuthForm from './AuthForm';

const SignIn = () => {
  return (
    <Card>
      <CardHeader>
        <motion.div
          initial={{
            x: 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          viewport={{ once: false }}
        >
          <CardTitle>Logowanie</CardTitle>
        </motion.div>
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          viewport={{ once: false }}
        >
          <CardDescription className="mb-[20px] md:mb-0">
            Wpisz nazwę użytkownika oraz hasło lub zaloguj się za pomocą innych usług.
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <AuthForm method="signIn" />
        <Providers />
      </CardContent>
    </Card>
  );
};

export default SignIn;
