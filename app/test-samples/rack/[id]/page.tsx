'use client';
import { Patient, TestTube } from '@/app/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Sample extends TestTube {
  patient: Patient;
}

export default function SamplesInRack() {
  const params = useParams();
  const [samples, setSamples] = useState<Sample[] | []>([]);

  useEffect(() => {
    if (params && params.id) {
      (async () => {
        try {
          const samples = await fetch(
            `/test-samples/rack/${params.id}/api`
          ).then((res) => res.json());
          setSamples(samples.samplesWithPatients);
        } catch (error) {
          console.log('Error fetching samples in rack: ' + params.id);
        }
      })();
    }
  }, [params]);

  return (
    <div className="w-full min-h-screen p-24">
      <h2
        data-testId="test-samples-in-rack-heading"
        className="text-2xl text-center font-bold"
      >
        Test Samples In Rack {params ? params.id : ''}
      </h2>

      {samples.length > 0 ? (
        <div className="grid text-center gap-2 w-full lg:mb-0 md:grid-cols-2 lg:grid-cols-4 lg:text-left mt-8">
          {samples.map((sample) => (
            <div
              className="group cursor-pointer border border-gray-400 flex flex-col gap-3 rounded-lg px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              key={sample.id}
            >
              <span className="font-medium text-lg">{sample.id}</span>
              <span>{sample.description}</span>
              <span className="text-sm bg-gray-300 dark:bg-gray-700 p-1 rounded-md">{`Patient: ${sample.patient.name}`}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full text-center mt-8">No test samples found</p>
      )}
    </div>
  );
}
