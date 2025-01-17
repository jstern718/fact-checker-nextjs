import { lusitana } from '@/app/ui/fonts';

export default function PostsPage() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Posts
      </h1>
      <p>Welcome to the Posts page!</p>
    </main>
  );
}
