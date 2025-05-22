import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import UserTable from './UserTable';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserTable Component', () => {
  // Mock user data that matches our API structure
  const mockUsers = [
    {
      name: "Test User1",
      created_at: "2020-10-01",
      password_changed_at: "2021-10-01",
      last_access_at: "2025-01-04",
      mfa_enabled: true,
    },
    {
      name: "Test User2",
      created_at: "2019-09-20",
      password_changed_at: "2019-09-22",
      last_access_at: "2025-02-08",
      mfa_enabled: false,
    },
    {
      name: "Test User3",
      created_at: "2023-03-07",
      password_changed_at: "2023-03-10",
      last_access_at: "2022-01-03",
      mfa_enabled: true,
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    
    // Mock the axios get call to return our test data
    mockedAxios.get.mockResolvedValue({ data: mockUsers });
  });

  test('renders loading state initially', () => {
    render(<UserTable />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  test('renders user data after loading', async () => {
    render(<UserTable />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });
    
    // Check if user data is displayed
    expect(screen.getByText('Test User1')).toBeInTheDocument();
    expect(screen.getByText('Test User2')).toBeInTheDocument();
    expect(screen.getByText('Test User3')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock API failure
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<UserTable />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch users data/i)).toBeInTheDocument();
    });
  });
}); 