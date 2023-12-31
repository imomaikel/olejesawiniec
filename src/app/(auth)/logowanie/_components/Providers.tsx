'use client';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

const Providers = () => {
  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-center">
        <div className="w-full h-[1px] bg-gray-200" />
        <div className="absolute bg-white px-3 text-sm text-muted-foreground">albo za pomocą</div>
      </div>
      <div className="mt-6 flex w-full items-center justify-center gap-x-4">
        <div role="button" className="group">
          <FaGoogle className="w-8 h-8 group-hover:text-primary transition-colors" />
        </div>
        <div role="button" className="group">
          <FaFacebook className="w-8 h-8 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Providers;
