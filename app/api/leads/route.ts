import { NextResponse } from "next/server";
import { demoLeads } from "@/lib/demo-data";
export async function GET() { return NextResponse.json({ data: demoLeads, meta: { source: "fictional-demo", productionDatabaseRequired: true } }); }
