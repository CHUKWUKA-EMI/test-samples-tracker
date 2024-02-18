import prisma from '@/app/lib/prisma';
import { TestTube, Rack, PatientSample } from '@/app/types';
import { canAssignToRack, isInValidFormData } from '@/app/utils';

export async function GET() {
  const patients = await prisma.patient.findMany();

  return Response.json({ patients });
}

export async function POST(request: Request) {
  try {
    const testSamplesPayload = (await request.json()) as {
      [key: number]: TestTube;
    };
    if (isInValidFormData(testSamplesPayload)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid form data. Include all required fields'
        },
        { status: 400 }
      );
    }
    const testSamplesData = Object.values(testSamplesPayload);
    const patientIds = testSamplesData.map((testTube) => testTube.patientId);

    const patientsPromise = prisma.patient.findMany({
      where: { id: { in: patientIds } }
    });

    const racksPromise = prisma.rack.findMany({
      include: {
        testSamples: true
      }
    });

    const [patients, racks] = await Promise.all([
      patientsPromise,
      racksPromise
    ]);

    const patientsSamples: PatientSample[] = testSamplesData.map((sample) => {
      const patient = patients.find((p) => p.id === sample.patientId)!;
      return {
        sample,
        patient
      };
    });
    const racksWithNewsamples = assignNewSamplesToRacks(patientsSamples, racks);
    const assignToRacks = racksWithNewsamples.map((rack) => {
      return prisma.rack.update({
        where: { id: rack.id },
        data: {
          testSamples: {
            createMany: {
              data: rack.testSamples,
              skipDuplicates: true
            }
          },
          updatedAt: new Date()
        },
        include: { _count: true, testSamples: true }
      });
    });
    const result = await Promise.all(assignToRacks);
    return Response.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}

function assignNewSamplesToRacks(
  patientsSamples: PatientSample[],
  racks: Rack[]
) {
  const availableRacksWithNewSamples: Rack[] = [];
  patientsSamples.forEach((ps) => {
    const patient = ps.patient;
    const sample = ps.sample;

    const availableRack = racks.find(async (rack) => {
      const patientsInRack = await prisma.patient.findMany({
        where: { id: { in: rack.testSamples.map((ts) => ts.patientId) } }
      });

      const duplicateSample = rack.testSamples
        .map((ts) => ts.id)
        .includes(sample.id);
      if (!duplicateSample && canAssignToRack(patient, patientsInRack)) {
        return rack;
      }
    });

    if (availableRack) {
      availableRack.testSamples.push(sample);
      availableRacksWithNewSamples.push(availableRack);
    }
  });

  return availableRacksWithNewSamples;
}
