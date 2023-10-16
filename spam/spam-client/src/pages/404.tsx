import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>없는 페이지입니다.</h2>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  );
}
