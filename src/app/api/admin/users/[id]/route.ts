import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, plan, accountType, password } = body;

    // First fetch current metadata to avoid overriding other fields unexpectedly
    const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (getUserError) throw getUserError;

    const currentUserMetadata = userData.user.user_metadata;
    const newMetadata = {
      ...currentUserMetadata,
      ...(name && { name }),
      ...(plan && { plan }),
      ...(accountType && { accountType })
    };

    const updateData: any = {
      user_metadata: newMetadata
    };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);

    if (error) throw error;

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      plan: data.user.user_metadata?.plan,
      accountType: data.user.user_metadata?.accountType,
      joined: new Date(data.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
