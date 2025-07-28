// /app/api/departments/route.js
import connectToDB from "@/configs/db";
import DepartmentModel from "@/models/Department";

export async function GET() {
  try {
    await connectToDB(); // ✅ مهم
    const departments = await DepartmentModel.find({}).lean();
    return Response.json(departments, { status: 200 });
  } catch (err) {
    console.error("GET /api/departments error:", err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB(); // ✅ مهم
    const body = await req.json();
    const { title } = body;

    await DepartmentModel.create({ title });

    return Response.json(
      { message: "Department created successfully :))" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/departments error:", err);
    return Response.json({ message: "Server Error" }, { status: 500 });
  }
}
