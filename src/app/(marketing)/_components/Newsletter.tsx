'use client';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { errorToast } from '@/lib/utils';
import { useState } from 'react';

const Newsletter = () => {
  const [value, setValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: signUpForNewsletter, isLoading } = trpc.signUpForNewsletter.useMutation();

  const handleClick = () => {
    signUpForNewsletter(
      { email: value },
      {
        onSuccess: ({ error, message, success }) => {
          if (error) {
            errorToast(message);
          } else if (success) {
            setIsDialogOpen(true);
          }
        },
        onError: (error) => {
          errorToast(error.data?.zodErrorList);
        },
      },
    );
  };

  return (
    <>
      {' '}
      <div className="relative h-auto">
        <div className="bg-footer bg-no-repeat bg-cover bg-center flex items-center justify-center lg:justify-end w-full min-h-[768px] relative px-8 lg:px-0">
          <div className="bg-black/90 w-full lg:w-[650px] h-[500px] lg:mr-40 rounded-md text-white z-10 flex flex-col p-12 space-y-12">
            <h3 className="text-primary tracking-wide font-normal mb-2 text-lg">Dołącz Do Nas</h3>
            <h2 className="font-bold whitespace-pre-wrap text-2xl lg:text-4xl">
              Podaj swój adres email i bądź na bieżąco.
            </h2>

            <div className="w-full rounded-full bg-gray-600 h-16 flex p-3">
              <div className="w-full lg:w-3/5 h-full rounded-full">
                <input
                  className="w-full h-full bg-transparent outline-none px-2 lg:px-4 text-xs lg:text-base"
                  placeholder="Podaj swój adres e-mail"
                  type="email"
                  disabled={isLoading}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <Button
                className="h-full w-2/5 rounded-full hidden lg:block text-black"
                onClick={handleClick}
                disabled={isLoading}
              >
                Zapisz
              </Button>
            </div>
            <Button
              className="rounded-full shadow-md shadow-primary lg:hidden text-black"
              size="2xl"
              onClick={handleClick}
              disabled={isLoading}
            >
              Zapisz
            </Button>
          </div>
          <div className="absolute w-full h-full bg-black/20 top-0 z-0 backdrop-blur-sm" />
        </div>
      </div>
      {value && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Newsletter</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                Na podany adres email została wysłana wiadomość. Prosimy o kliknięcie w link znajdujący się w wiadomości
                aby potwierdzić zapisanie się do newsletter&apos;a.
              </p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Zamknij
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Newsletter;

// TODO Send mail
