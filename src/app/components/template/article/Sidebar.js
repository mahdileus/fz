import Link from "next/link";
import Image from "next/image";

export default function SidebarArticles({ articles }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      {articles.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row gap-3 items-start"
        >
          {/* تصویر */}
          <div className="flex-shrink-0 w-full sm:w-20 aspect-square">
            <Image
            width={80}
            height={80}
              src={
                item?.thumbnail?.startsWith("http")
                  ? item.thumbnail
                  : `https://firouzehjavaherian.com${item.thumbnail}`
              }
              alt={item?.title || "thumbnail"}
              className="w-full h-full object-cover rounded-md"
              
            />
          </div>

          {/* متن */}
          <div className="flex flex-col justify-between text-right flex-1">
            <h4 className="font-semibold text-sm text-primary line-clamp-2">
              <Link href={`/post/${item.slug}`}>{item.title}</Link>
            </h4>

            {item.longDescription && (
              <p
                className="text-xs text-gray-500 mt-1 line-clamp-3 break-words"
                dangerouslySetInnerHTML={{ __html: item.longDescription }}
              />
            )}

            <div className="flex justify-between text-xs text-gray-600 mt-2 flex-wrap gap-2">
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
