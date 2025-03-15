import { useRouter } from "next/router";
export default function Page() {
  const router = useRouter();
  return (
    <main>
      <div>
        <h1>Page for Individual Worlds Lol</h1>
        <p>ID : {router.query.id}</p>
      </div>
    </main>
  );
}
