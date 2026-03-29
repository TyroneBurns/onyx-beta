import { NextResponse } from 'next/server';
import { shadowComparisons, performanceSeries } from '@/data/mock';
export async function GET() { return NextResponse.json({ shadowComparisons, performanceSeries }); }
