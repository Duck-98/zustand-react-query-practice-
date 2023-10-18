import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLogin(false);
    toast.success('로그아웃 되었습니다.');
    router.push('/login');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLogin(true);
    }
  }, [router.query]);

  return (
    <div className="">
      <header className="p-5 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link href="/" className={`p-1.5 rounded-md ${router.pathname === '/' && 'bg-red-400'}`}>
            Block
          </Link>
          <Link
            href="/restore"
            className={`p-1.5 rounded-md ${router.pathname === '/restore' && 'bg-red-400'}`}
          >
            Restore
          </Link>
        </div>
        {isLogin && (
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
