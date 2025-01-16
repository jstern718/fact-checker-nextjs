import { lusitana } from '@/app/ui/fonts';
import { fetchTopics } from '@/app/lib/data';

export default async function TopicsPage() {
  const topic = await fetchTopics();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Topics
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topic.map((post) => (
          <div key={topic.topicName} className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <h3 className="ml-2 text-sm font-medium">{topic.topicName}</h3>
            <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
              {post.username}
            </p>
          </div>
        ))}
      </div> */}
    </main>
  );
}
