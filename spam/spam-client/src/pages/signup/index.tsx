import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:7777/signup', {
        email: email,
        password: password,
      });
      router.push('/login');
    } catch (error) {
      console.error('에러가 발생했습니다:', error);
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
        <h1 className="text-2xl text-center font-semibold">회원가입</h1>
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
          <button onClick={handleSignUp} className="bg-red-300 rounded p-2">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
