import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const racks = await prisma.rack.findMany({
      include: { testSamples: true }
    });
    return Response.json({ success: true, racks }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 400 });
  }
}
