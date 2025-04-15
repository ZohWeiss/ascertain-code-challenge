import { Patient, usePatients } from '@queries/patient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PatientList from '../PatientList';
import PatientSearch from '../PatientSearch';

// Mock the usePatients hook
vi.mock('@queries/patient', () => ({ usePatients: vi.fn() }));

const mockPatients: Patient[] = [
  { id: '1', full_name: 'Bukayo Saka', birth_date: '2001-09-05', resourceType: 'Patient' },
  { id: '2', full_name: 'Declan Rice', birth_date: '1999-01-14', resourceType: 'Patient' },
  { id: '3', full_name: 'Thierry Henry', birth_date: '1977-08-17', resourceType: 'Patient' },
];

describe('Patient Components', () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { patients: mockPatients },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('PatientSearch', () => {
    it('updates search term when typing in the search field', async () => {
      const searchQuery = 'sAKa';
      render(
        <QueryClientProvider client={queryClient}>
          <PatientSearch />
        </QueryClientProvider>
      );

      act(() => {
        fireEvent.change(screen.getByPlaceholderText('Search patients by name...'), {
          target: { value: searchQuery },
        });
      });

      expect(screen.getByPlaceholderText('Search patients by name...')).toHaveValue(searchQuery);
      expect(usePatients).toHaveBeenCalledWith({ name: searchQuery });
    });
  });

  describe('PatientResults', () => {
    it('displays loading state while fetching patients', () => {
      (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
        isLoading: true,
        data: null,
        isError: false,
        error: null,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PatientList isLoading={true} patients={[]} />
        </QueryClientProvider>
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('displays empty state when no patients match search', () => {
      (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
        data: { patients: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PatientList isLoading={false} patients={[]} />
        </QueryClientProvider>
      );

      expect(screen.getByText(/no patients found/i)).toBeInTheDocument();
    });

    it('displays error state when patient fetch fails', () => {
      (usePatients as ReturnType<typeof vi.fn>).mockReturnValue({
        isLoading: false,
        data: null,
        isError: true,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PatientSearch />
        </QueryClientProvider>
      );

      expect(screen.getByText(/Failed to load patients/i)).toBeInTheDocument();
    });

    it('displays patient data when available', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <PatientList isLoading={false} patients={mockPatients} />
        </QueryClientProvider>
      );

      expect(screen.getByText('Bukayo Saka')).toBeInTheDocument();
      expect(screen.getByText('Declan Rice')).toBeInTheDocument();
      expect(screen.getByText('Thierry Henry')).toBeInTheDocument();
    });
  });
});
