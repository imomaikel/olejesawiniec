'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { forgotPassword } from '@/lib/authenticate';
import FormSuccess from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TForgotPassword = {
  open: boolean;
  onOpenChange: () => void;
  defaultValue?: string;
};
const ForgotPassword = ({ onOpenChange, open, defaultValue }: TForgotPassword) => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    if (isPending) return;
    onOpenChange();
  };

  const handleSubmit = () => {
    setSuccess('');
    setError('');
    startTransition(() => {
      forgotPassword(value)
        .then(({ message, error, success }) => {
          if (error) {
            setError(message);
          } else if (success) {
            setSuccess(message);
          }
        })
        .catch(() => setError('Wystąpił błąd.'));
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Przypomnienie hasła</DialogTitle>
          <DialogDescription>Odzyskaj utracone hasło.</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="forgot-email">Adres e-mail</Label>
          <Input
            defaultValue={defaultValue}
            id="forgot-email"
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-muted-foreground mt-4 text-sm">
            Po kliknięciu przycisku, wyślemy email z przyciskiem do ustawienia nowego hasła do Twojego konta.
          </p>
          <div>
            {success.length >= 1 && <FormSuccess description={success} />}
            {error.length >= 1 && <FormError description={error} />}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Anuluj
          </Button>
          <Button className="w-[200px]" disabled={isPending} onClick={handleSubmit}>
            Przypomnij hasło
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
