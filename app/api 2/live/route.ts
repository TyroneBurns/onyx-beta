import { NextResponse } from 'next/server';
import { livePositions, liveOrders, systemHealth } from '@/data/mock';
export async function GET() { return NextResponse.json({ livePositions, liveOrders, systemHealth }); }
