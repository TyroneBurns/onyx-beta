import { NextResponse } from 'next/server';
import { trades } from '@/data/mock';
export async function GET() { return NextResponse.json({ trades }); }
