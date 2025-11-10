// app/api/send-message/route.ts
import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  let body: { username?: string; content?: string } = {};
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ message: 'Invalid JSON body', success: false }, { status: 400 });
  }

  const { username, content } = body;

  if (!username || typeof username !== 'string') {
    return NextResponse.json({ message: 'Missing or invalid username', success: false }, { status: 400 });
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ message: 'Message content cannot be empty', success: false }, { status: 400 });
  }

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return NextResponse.json({ message: 'User is not accepting messages', success: false }, { status: 403 });
    }

    const newMessage: Partial<Message> = { content: content.trim(), createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json({ message: 'Message sent successfully', success: true }, { status: 201 });
  } catch (error) {
    console.error('❌ Error adding message:', error);
    return NextResponse.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}
