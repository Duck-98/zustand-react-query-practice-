
export default function Home() {
  const url = "http://localhost:7777/block";

  fetch(url)
    .then((response) => response.json())
    .then(console.log);

  return (
    <main>
  
    </main>
  )
}
