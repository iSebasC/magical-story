import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/modules/user/user.service';

export async function GET(request: NextRequest) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json({
      success: true,
      data: users,
      message: 'Usuarios obtenidos correctamente'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await userService.createUser(body);
    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuario creado correctamente'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
