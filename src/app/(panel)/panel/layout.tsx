import PanelControls from './_components/PanelControls';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';

const PanelLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const role = session?.user.role;

  if (!(role === 'ADMIN' || role === 'SUPPORT')) redirect('/logowanie');

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col relative px-4 md:px-12">
        <Navbar className="relative mt-4" textColor="black" topPadding={0} />

        <Separator className="my-4" />

        <div className="flex space-x-0 md:space-x-12 mb-24">
          <div className="hidden md:flex flex-col space-y-6 w-[250px] relative">
            <div className="flex flex-col space-y-1">
              <PanelControls />
            </div>
            <div className="after:absolute after:h-full after:w-[1px] after:bg-black/40 after:-right-6 after:top-0" />
          </div>
          <div className="flex w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PanelLayout;
