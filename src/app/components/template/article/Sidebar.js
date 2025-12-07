import Link from "next/link";
import Image from "next/image";

// SidebarArticles.js
export default function SidebarArticles({ articles }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      {articles.map((item) => (
        <div key={item._id} className="flex flex-col md:flex-row gap-3">
          {/* تصویر */}
          <Image
            src={
              item?.thumbnail?.startsWith("http")
                ? item.thumbnail
                : `https://firouzehjavaherian.com${item.thumbnail}`
            }
            width={80}
            height={80}
            alt={item?.title || "thumbnail"}
            className="w-full md:w-20 h-40 md:h-20 object-cover rounded-md flex-shrink-0"
          />

          {/* متن */}
          <div className="flex flex-col justify-start text-right flex-1">
            <h4 className="font-semibold text-sm text-primary">
              <Link href={`/post/${item.slug}`}>{item.title}</Link>
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {item.shortDescription}
            </p>

            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span className="bg-light-blue text-primary px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <span>
                {new Date(item.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
