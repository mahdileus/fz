import PodcastBox from "@/app/components/template/p-admin/podcast/PodcastBox";
import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";
import Link from "next/link";
export default async function page() {
  await connectToDB();
  const podcats = await PodcastModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className=" mt-14 container">
      <div className=" px-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-6">تمام پادکست ها</h1>
        </div>
        <div>
          <Link href={"/p-admin/podcasts/add-podcast"} className="text-cream bg-primary p-3 rounded-2xl">افزودن پادکست جدید</Link>

        </div>
        
      </div>
              {podcats.map((podcast) => (
            <PodcastBox key={podcast._id} podcast={JSON.parse(JSON.stringify(podcast))} />
          ))}
    </section>
  );
}
