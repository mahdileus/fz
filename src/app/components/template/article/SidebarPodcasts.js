import Image from "next/image";

export default function SidebarPodcasts({ podcasts = [] }) {  // default [] اضافه کن
  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h3 className="text-base font-bold text-primary mb-6">آخرین پادکست‌ها</h3>
      <ul className="space-y-4">
        {podcasts?.map((podcast) => (  // ?.map اضافه کن تا اگر undefined بود, ارور نده
          <li key={podcast._id} className="flex gap-4 items-center">
            <Image src={podcast.thumbnail} alt={podcast.title} width={80} height={50} className="rounded" />
            <div>
              <a href={`/podcast/${podcast.slug}`} className="text-primary font-medium">{podcast.title}</a>
              <p className="text-sm text-gray-500">{podcast.shortDescription}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}