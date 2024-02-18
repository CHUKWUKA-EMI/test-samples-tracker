import prisma from '@/app/lib/prisma';

export async function GET(request: Request) {
  const rackId = request.url.split('/')[5];
  const samples = await prisma.testSample.findMany({ where: { rackId } });

  const patients = await Promise.all(
    samples.map((sample) =>
      prisma.patient.findFirst({
        where: { id: sample.patientId }
      })
    )
  );
  const samplesWithPatients = samples.map((sample) => ({
    ...sample,
    patient: patients.find((p) => p?.id === sample.patientId)
  }));

  return Response.json({ samplesWithPatients });
}
