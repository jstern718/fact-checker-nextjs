import { lusitana } from '@/app/ui/fonts';
import { fetchPosts } from '@/app/lib/data';

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Posts
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <h3 className="ml-2 text-sm font-medium">{post.title}</h3>
            <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
