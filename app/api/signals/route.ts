import { NextResponse } from 'next/server';
import { signalCards } from '@/data/mock';
export async function GET() { return NextResponse.json({ signalCards }); }
