import { Patient, TestTube } from '../types';

export const canAssignToRack = (
  patient: Patient,
  patientsInRack: Patient[]
) => {
  const isLegal = patientsInRack.some((patientInRack) => {
    if (
      patientInRack.age === patient.age ||
      patientInRack.company === patient.company ||
      patientInRack.visionDefect === patient.visionDefect ||
      (patientInRack.city === patient.city &&
        patientInRack.district === patient.district)
    ) {
      return false;
    }
    return true;
  });

  return isLegal;
};

export const isInValidFormData = (testSamples: { [key: number]: TestTube }) => {
  const isInvalid = (
    Object.keys(testSamples) as unknown as Array<keyof typeof testSamples>
  ).some((key) => {
    if (!testSamples[key]) return true;
    return (Object.keys(testSamples[key]) as Array<keyof TestTube>).some(
      (field) => !testSamples[key][field]
    );
  });

  return isInvalid;
};
