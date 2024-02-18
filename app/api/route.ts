import prisma from "../lib/prisma";

export async function GET() {
    const racks = await prisma.rack.findMany({ include: { testSamples: true } })
    
    return Response.json({racks})
}