import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Error = () => {
  return (
    <Card className="h-[417px]">
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
          <CardTitle>Wystąpił błąd</CardTitle>
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
          <CardDescription>Wystąpił błąd podczas logowania.</CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>Powróć na stronę logowania aby spróbować ponownie.</CardContent>
    </Card>
  );
};

export default Error;
