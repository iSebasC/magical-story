import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    });

    if (error) throw error;

    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || 'No Name',
      plan: user.user_metadata?.plan || 'free',
      accountType: user.user_metadata?.accountType || 'parent',
      reads: 0, // Mocked for now
      joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, plan, accountType } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        plan: plan || 'free',
        accountType: accountType || 'parent'
      }
    });

    if (error) throw error;

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      plan: data.user.user_metadata?.plan,
      accountType: data.user.user_metadata?.accountType,
      reads: 0,
      joined: new Date(data.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
