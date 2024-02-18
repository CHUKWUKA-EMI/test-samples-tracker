'use client';
import { Patient, TestTube } from '../../types';
import { isInValidFormData } from '../../utils';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

function TestSampleFormFieldset({
  patients,
  disabled = false,
  sampleNumber,
  patientId,
  sampleDescription,
  testTubeId,
  handleChange
}: {
  patients: Patient[];
  disabled: boolean;
  sampleNumber: number;
  testTubeId: string;
  sampleDescription: string;
  patientId: string;
  handleChange: (
    sampleNumber: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <fieldset
      id={`sample${sampleNumber}`}
      disabled={disabled}
      className="w-full border p-3 border-gray-400 flex flex-col gap-3 mx-auto mt-4"
    >
      <legend className="font-medium"> {`Sample ${sampleNumber}`}</legend>
      <div className="w-full">
        <label htmlFor="id">Test Tube ID</label>
        <input
          id="id"
          name="id"
          value={testTubeId}
          onChange={(e) => handleChange(sampleNumber, e)}
          required
          className="w-full p-2 rounded-md bg-inherit dark:text-white text-gray-600 placeholder:font-medium placeholder:text-gray-400 border dark:border-green-500 border-green-600 outline-none"
        />
      </div>

      <div className="w-full">
        <label htmlFor="id">Test Sample Description</label>
        <input
          id="description"
          name="description"
          value={sampleDescription}
          onChange={(e) => handleChange(sampleNumber, e)}
          required
          className="w-full p-2 rounded-md bg-inherit dark:text-white text-gray-600 placeholder:font-medium placeholder:text-gray-400 border dark:border-green-500 border-green-600 outline-none"
        />
      </div>

      <div className="w-full">
        <label htmlFor="id">Patient</label>
        <select
          id="patientId"
          name="patientId"
          value={patientId}
          required
          className="w-full p-2 rounded-md bg-inherit dark:text-white text-gray-600 placeholder:font-medium placeholder:text-gray-400 border dark:border-green-500 border-green-600 outline-none"
          onChange={(e) => handleChange(sampleNumber, e)}
        >
          <option>Select patient</option>
          {patients.length &&
            patients.map((patient) => (
              <option value={patient.id} key={patient.id}>
                {patient.name}
              </option>
            ))}
        </select>
      </div>
    </fieldset>
  );
}

const MAX_NUMBER_OF_SAMPLES_TO_SEND = 10;

export default function NewSample() {
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [patients, setPatients] = useState<Patient[] | []>([]);
  const [testSamples, setTestSamples] = useState<{ [key: number]: TestTube }>({
    1: { description: '', id: '', patientId: '' }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const patientsRes = await fetch('/test-samples/new/api', {
          method: 'GET'
        });
        const patientsData = await patientsRes.json();
        setPatients(patientsData.patients);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    })();
  }, []);

  const addMoreTestSamples = () => {
    const numberOfSamplesKeys = Object.keys(testSamples).length;
    if (numberOfSamplesKeys >= MAX_NUMBER_OF_SAMPLES_TO_SEND) {
      setErrorMessage(
        'You have reached the maximum number of samples you can add'
      );
      return;
    }
    const newKey = numberOfSamplesKeys + 1;
    setTestSamples({
      ...testSamples,
      [newKey]: { description: '', id: '', patientId: '' }
    });
    setTimeout(() => {
      if (submitButtonRef.current) {
        submitButtonRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const removeTestSample = (key: number) => {
    if (Object.keys(testSamples).length === 1) {
      return;
    }
    const testSamplesCopy = { ...testSamples };
    (
      Object.keys(testSamplesCopy) as unknown as Array<
        keyof typeof testSamplesCopy
      >
    ).forEach((entryKey) => {
      if (entryKey === key) {
        delete testSamplesCopy[entryKey];
      }
    });
    setTestSamples(testSamplesCopy);
  };

  const handleChange = (
    sampleNumber: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setTestSamples({
      ...testSamples,
      [sampleNumber]: { ...testSamples[sampleNumber], [name]: value }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isInValidFormData(testSamples)) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/test-samples/new/api`, {
        method: 'POST',
        body: JSON.stringify(testSamples)
      });
      if (response.status !== 200) {
        setIsSubmitting(false);
        setErrorMessage((await response.json()).error);
        return;
      }
      setSuccessMessage('Successfully added test samples!');
      setTimeout(() => {
        router.push('/test-samples');
      }, 1000);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-24">
      <form
        data-testId="new-samples-form"
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center md:w-[80%] lg:w-[60%] mx-auto"
      >
        <h2 className="text-xl md:text-2xl dark:text-green-500 text-green-600 text-center font-semibold">
          Add New Test Sample(s)
        </h2>
        {(
          Object.keys(testSamples) as unknown as Array<keyof typeof testSamples>
        ).map((key, index) => (
          <div className="w-full md:w-[80%] flex items-end gap-1" key={key}>
            <TestSampleFormFieldset
              sampleNumber={index + 1}
              patients={patients}
              disabled={false}
              testTubeId={testSamples[key].id}
              patientId={testSamples[key].patientId}
              sampleDescription={testSamples[key].description}
              handleChange={handleChange}
            />
            <button
              type="button"
              disabled={Object.keys(testSamples).length == 1}
              onClick={() => removeTestSample(key)}
              title="Remove sample"
              className={`w-fit p-2 text-sm rounded-[100%] ${Object.keys(testSamples).length <= 1 ? 'hidden' : ''} text-white dark:bg-gray-500 dark:hover:bg-gray-600 hover:bg-gray-500 bg-gray-400`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
                />
              </svg>
            </button>
          </div>
        ))}
        <div className="w-full mt-2 md:w-[80%]">
          {errorMessage.length > 0 && (
            <span className="w-fit p-2 rounded-md text-white bg-red-600">
              {errorMessage}
            </span>
          )}
          {errorMessage.length > 0 && (
            <span className="w-full p-2 rounded-md text-white bg-green-600">
              {errorMessage}
            </span>
          )}
          <div className="w-full flex items-center gap-4">
            <button
              disabled={
                Object.keys(testSamples).length >= MAX_NUMBER_OF_SAMPLES_TO_SEND
              }
              onClick={addMoreTestSamples}
              type="button"
              className={`flex  items-center gap-2 outline-none p-1 rounded-md text-white font-medium bg-neutral-500 ${Object.keys(testSamples).length >= MAX_NUMBER_OF_SAMPLES_TO_SEND ? 'hidden' : ''}`}
            >
              <span className="">Add more</span>{' '}
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
            </button>
            <em className="dark:text-gray-300 text-gray-600">
              You can add{' '}
              <b>
                {MAX_NUMBER_OF_SAMPLES_TO_SEND -
                  Object.keys(testSamples).length}
              </b>{' '}
              more samples
            </em>
          </div>
        </div>

        <div className="w-full mt-4 md:w-[80%]">
          <button
            ref={submitButtonRef}
            disabled={isInValidFormData(testSamples) || isSubmitting}
            type="submit"
            className="w-full outline-none p-2 rounded-md text-white font-medium transition-transform hover:translate-y-1 disabled:hover:translate-y-0 bg-green-600 disabled:bg-neutral-500 disabled:text-gray-400"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
