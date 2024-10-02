import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo à aplicação DJ</h1>
      <p>Esta é a página inicial.</p>
      <Link href="/about">Ir para Sobre</Link>
      <Link href="/dj-board">Ir para DJ Board</Link>
    </div>
  );
};

export default Home;

