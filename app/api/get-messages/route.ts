// app/api/get-messages/route.ts
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // getServerSession in app router works without req/res in some setups,
    // but being explicit here is safer for future changes.
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log('❌ GET /api/get-messages: Not authenticated');
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const _user = session.user as any;

    // session user may store id, _id, name, email, username — be flexible
    const userIdString = _user.id ?? _user._id ?? null;
    const username = _user.username ?? _user.name ?? null;
    const email = _user.email ?? null;

    if (!userIdString && !username && !email) {
      console.log('❌ GET /api/get-messages: No identifier in session (id/username/email)');
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 400 });
    }

    // Ensure DB connected
    await dbConnect();

    // Try to find user by id if valid ObjectId, otherwise fallback to username/email.
    let user: any = null;

    if (userIdString && mongoose.Types.ObjectId.isValid(userIdString)) {
      user = await UserModel.findById(userIdString).select('messages').lean();
      if (!user) {
        console.log(`⚠️ GET /api/get-messages: No user found by id (${userIdString}), will try username/email fallback.`);
      }
    } else if (userIdString) {
      console.log(`⚠️ GET /api/get-messages: session id present but not a valid ObjectId (${userIdString}), trying fallback lookups.`);
    }

    // Fallback: try username or email
    if (!user) {
      if (username) {
        user = await UserModel.findOne({ username }).select('messages').lean();
        if (user) console.log(`🔎 GET /api/get-messages: Found user by username: ${username}`);
      }
      if (!user && email) {
        user = await UserModel.findOne({ email }).select('messages').lean();
        if (user) console.log(`🔎 GET /api/get-messages: Found user by email: ${email}`);
      }
    }

    if (!user) {
      console.log('❌ GET /api/get-messages: User not found in database (tried id/username/email)');
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Normalize messages and sort by createdAt descending
    const rawMessages: any[] = Array.isArray(user.messages) ? user.messages : [];

    const messages = rawMessages
      .map((m) => {
        // Defensive normalization: ensure _id is string and createdAt is ISO string
        const normalized = {
          ...m,
          _id: m._id ? String(m._id) : undefined,
          createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
        };
        return normalized;
      })
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error: any) {
    console.error('❌ GET /api/get-messages error:', error);
    const message = (error && error.message) ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
