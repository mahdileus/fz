import connectToDB from "@/configs/db";
import { authUser } from "@/utils/auth-server";
import TicketModel from "@/models/Ticket";

export async function POST(req) {
  try {
    connectToDB();
    const user = await authUser();    
    
        const reqBody = await req.json();
    const { title, body, department,priority } = reqBody;

    // Validation (You)

    await TicketModel.create({
      title,
      body,
      department,
      priority,
      user: user._id,
    });

    return Response.json(
      { message: "Ticket saved successfully :))" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    
    return Response.json({ message: err }, { status: 500 });
  }
}
