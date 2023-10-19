import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:7777/login', {
        email: email,
        password: password,
      });
      localStorage.setItem('accessToken', response.data.accessToken);
      router.replace('/');
      toast.success('로그인 되었습니다.');
    } catch (error) {
      console.error('에러가 발생했습니다:', error);
      toast.error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      toast.error('이미 로그인 되어있습니다.');
      router.push('/');
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center mt-52">
      <div className="flex flex-col w-[500px] space-y-4">
        <h1 className="text-2xl text-center font-semibold">로그인</h1>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={email}
            placeholder="아이디를 입력하세요."
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button onClick={handleLogin} className="bg-red-300 rounded p-2">
            로그인
          </button>
          <Link href="/signup" className="text-lg font-bold">
            회원가입하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
