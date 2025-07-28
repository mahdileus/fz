import connectToDB from "@/configs/db";
import TicketModel from "@/models/Ticket";
import { authUser } from "@/utils/auth-server";

export async function POST(req) {
  try {
    connectToDB();
    const reqBody = await req.json();
    const { title, body, department, priority, ticketID } =
      reqBody;
    const user = await authUser();    

    await TicketModel.findOneAndUpdate(
      { _id: ticketID },
      {
        $set: {
          hasAnswer: true,
        },
      }
    );

    await TicketModel.create({
      title,
      body,
      department,
      priority,
      user: user._id,
      hasAnswer: false,
      isAnswer: true,
      mainTicket: ticketID,
    });

    return Response.json(
      { message: "Answer saved successfully :))" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ message: err }, { status: 500 });
  }
}
