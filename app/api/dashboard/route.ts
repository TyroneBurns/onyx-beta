import { NextResponse } from 'next/server';
import { overviewKpis, heroStats, activityFeed, systemHealth } from '@/data/mock';
export async function GET() { return NextResponse.json({ heroStats, overviewKpis, activityFeed, systemHealth }); }
