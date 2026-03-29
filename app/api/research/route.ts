import { NextResponse } from 'next/server';
import { researchRuns, latencySeries } from '@/data/mock';
export async function GET() { return NextResponse.json({ researchRuns, latencySeries }); }
