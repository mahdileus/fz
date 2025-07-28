import EditPodcastForm from "@/app/components/template/p-admin/podcast/EditPodcastForm";
import connectToDB from "@/configs/db";
import PodcastModel from "@/models/Podcast";

export default async function EditCoursePage({ params }) {
      const { id } = await params;

  await connectToDB();
  const podcast = await PodcastModel.findById( id).lean();

  return (
    <div className="mt-10">
      <EditPodcastForm
        podcast={JSON.parse(JSON.stringify(podcast))}
        podcastId={id}
      />
    </div>
  );
}
