import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Authentication Page Using Next</h1>
      <Link href="/register">Registeration Page</Link>
      <Link href="/login">Login Page </Link>

    </main>
  );
}
