import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const { db } = await connectToDatabase();
  try {
    const user = await db.collection('users').findOne({ email });
    return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}


export async function POST(req) {
  const { db } = await connectToDatabase();
  const body = await req.json();

  try {
    const { email, ...updateData } = body;
    const result = await db.collection('users').updateOne(
      { email: email }, // Use email as the unique identifier
      { $set: updateData },
      { upsert: true }
    );
    
    if (result.upsertedCount > 0) {
      return new Response(JSON.stringify({ success: true, message: 'New document created', data: result }), { status: 201 });
    } else {
      return new Response(JSON.stringify({ success: true, message: 'Document updated', data: result }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}