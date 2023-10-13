import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useRouter();

  return (
    <div className="">
      <header className="p-4">
        <div className="flex space-x-4">
          <Link href="/" className={`p-1.5 rounded-md ${pathname === '/' && 'bg-red-400'}`}>
            Block
            {/* <span className={`p-1.5 rounded-md ${pathname === '/' && 'bg-red-400'}`}>Block</span> */}
          </Link>
          <Link
            href="/restore"
            className={`p-1.5 rounded-md ${pathname === '/restore' && 'bg-red-400'}`}
          >
            Restore
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
