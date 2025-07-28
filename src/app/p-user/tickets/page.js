import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import TicketModel from "@/models/Ticket";
import Tickets from "@/app/components/template/p-user/tickets/Tickets";

const page = async () => {
  connectToDB();
  const user = await authUser();
  const tickets = await TicketModel.find({ user: user._id, isAnswer: false })
    .populate("department", "title")
    .sort({ _id: -1 });
    console.log("user:",user);
    

  return (
      <Tickets tickets={JSON.parse(JSON.stringify(tickets))} />
  );
};

export default page;
