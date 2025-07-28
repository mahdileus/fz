import Link from "next/link";
import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import Answer from "@/app/components/template/p-user/tickets/Answer";

const page = async ({ params }) => {
const resolvedParams = await params; // params را await کنید
  const ticketID = resolvedParams.id; // حالا به id دسترسی پیدا کنید
  connectToDB();

  const ticket = await TicketModel.findOne({ _id: ticketID })
    .populate("user", "name")
    .lean();

  const answerTicket = await TicketModel.findOne({
    mainTicket: ticket._id,
  }).populate("user", "name").lean();

  return (
    <main className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">نمایش تیکت</h1>
        <Link
          href="/p-user/tickets/sendticket"
          className="text-sm text-white bg-primary px-4 py-2 rounded-xl hover:bg-primary/90 transition"
        >
          ارسال تیکت جدید
        </Link>
      </div>

      <div className="space-y-6">
        {/* تیکت اصلی */}
        <Answer type="user" {...ticket} />

        {/* پاسخ مدیر در صورت وجود */}
        {answerTicket && <Answer type="admin" {...answerTicket} />}

        {/* اگر پاسخی وجود ندارد */}
        {!answerTicket && (
          <div className="bg-light-blue text-primary p-4 rounded-xl text-center">
            هنوز پاسخی برای این تیکت ثبت نشده است.
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
