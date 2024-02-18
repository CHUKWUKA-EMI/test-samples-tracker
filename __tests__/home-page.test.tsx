import { test, assert, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import Racks from '../app/test-samples/page';
import SamplesInRack from '../app/test-samples/rack/[id]/page';

test('Testing home page', () => {
  render(<Home />);
  assert.strictEqual(
    screen.getByRole('heading', {
      level: 1
    }).textContent,
    'Welcome to Test Samples Tracker'
  );
});

test('Testing test-samples page', () => {
  render(<Racks />);
  assert.strictEqual(
    screen.getByRole('heading', { level: 2 }).textContent,
    'Test Samples Racks'
  );

  expect(screen.getByRole('button', {})).toBeDefined();
});

test('Testing test-samples-in-rack page', () => {
  render(<SamplesInRack />);
  assert.strictEqual(
    screen
      .getByTestId('test-samples-in-rack-heading')
      .textContent?.includes('Test Samples In Rack'),
    true
  );
});
