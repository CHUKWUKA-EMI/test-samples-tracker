export type Patient = {
  id: string;
  name: string;
  email: string;
  age: number;
  company: string;
  city: string;
  district: string;
  visionDefect: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TestTube = {
  id: string;
  description: string;
  patientId: string;
};

export type PatientSample = {
  sample: TestTube;
  patient: Patient;
};

export type Rack = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  testSamples: TestTube[];
};

// const fn = (testTubes: TestTube[]) => {
//   const racks: Rack[] = [];

//   testTubes.forEach((currentTestTube) => {
//     const availableRack = racks.find((r) => {
//       r.find(
//         (t) =>
//           t.id !== currentTestTube.id && canAssignToRack(currentTestTube, t)
//       );
//     });

//     if (availableRack) {
//       availableRack.push(currentTestTube);
//     }
//   });
// };
