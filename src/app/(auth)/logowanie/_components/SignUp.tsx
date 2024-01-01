'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Providers from './Providers';
import AuthForm from './AuthForm';

const SignUp = () => {
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
          <CardTitle>Rejestracja</CardTitle>
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
          <CardDescription>
            Wpisz nazwę użytkownika oraz hasło aby utworzyć konto lub zarejestruj się za pomocą innych usług.
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <AuthForm method="signUp" />
        <Providers />
      </CardContent>
    </Card>
  );
};

export default SignUp;
