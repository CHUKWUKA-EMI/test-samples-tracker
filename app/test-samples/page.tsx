'use client';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { Rack } from '../types';

export default function Racks() {
  const [racks, setRacks] = useState<Rack[] | []>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`/test-samples/api`);
        const responseJSON = await response.json();
        if (response.status === 200) {
          setRacks(responseJSON.racks);
        } else {
          setErrorMessage('Error fetching test sample racks');
        }
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-24">
      <h2 className="text-2xl text-center font-bold">Test Samples Racks</h2>
      <div className="w-full flex items-center justify-center my-3">
        <button className="font-medium p-2 text-sm rounded-md bg-green-600 text-white outline-none">
          <Link
            className="w-full flex gap-3 items-center"
            href="test-samples/new"
          >
            <span className="">New sample</span>{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Link>
        </button>
      </div>
      <div className="grid text-center gap-2 lg:w-full lg:mb-0 md:grid-cols-2 lg:grid-cols-4 lg:text-left mt-8">
        <Suspense fallback="Loading...">
          {racks.length > 0 &&
            racks.map((rack, index) => (
              <Link
                href={`test-samples/rack/${rack.id}`}
                className="group border border-gray-400 flex flex-col gap-3 rounded-lg px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                key={rack.id}
              >
                <span className="font-medium text-lg">Rack {index + 1}</span>
                <span>{`${rack.testSamples.length} Test Samples`}</span>
                <span className="text-sm bg-gray-300 dark:bg-gray-700 p-1 rounded-md">{`Created: ${new Date(rack.createdAt).toDateString()}`}</span>
              </Link>
            ))}
        </Suspense>
      </div>
    </div>
  );
}
