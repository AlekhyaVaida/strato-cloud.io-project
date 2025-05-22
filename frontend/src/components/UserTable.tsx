import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { differenceInDays, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Stack
} from '@mui/material';

interface User {
  name: string;
  created_at: string;
  password_changed_at: string;
  last_access_at: string;
  mfa_enabled: boolean;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaFilter, setMfaFilter] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users data');
        setLoading(false);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleMfaFilterChange = (event: SelectChangeEvent) => {
    setMfaFilter(event.target.value);
  };

  const calculateDaysSince = (dateString: string): number => {
    const today = new Date();
    const date = parseISO(dateString);
    return differenceInDays(today, date);
  };

  const filteredUsers = users.filter(user => {
    if (mfaFilter === 'all') return true;
    if (mfaFilter === 'enabled') return user.mfa_enabled;
    if (mfaFilter === 'disabled') return !user.mfa_enabled;
    return true;
  });

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight="medium">
            MFA Status
          </Typography>
          <Select
            value={mfaFilter}
            onChange={handleMfaFilterChange}
            displayEmpty
            sx={{ minWidth: 200, maxWidth: 300 }}
            size="small"
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="enabled">MFA Enabled</MenuItem>
            <MenuItem value="disabled">MFA Disabled</MenuItem>
          </Select>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Human User</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Password Changed Date</TableCell>
              <TableCell>Days since last password change</TableCell>
              <TableCell>Last Access Date</TableCell>
              <TableCell>Days since Last Access</TableCell>
              <TableCell>MFA Enabled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => {
              const daysSincePasswordChange = calculateDaysSince(user.password_changed_at);
              const daysSinceLastAccess = calculateDaysSince(user.last_access_at);
              
              return (
                <TableRow 
                  key={user.name}
                  sx={{
                    backgroundColor: 
                      (daysSincePasswordChange > 365 || daysSinceLastAccess > 90) 
                        ? 'rgba(255, 0, 0, 0.1)' 
                        : 'inherit'
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>{user.password_changed_at}</TableCell>
                  <TableCell>
                    {daysSincePasswordChange}
                    {daysSincePasswordChange > 365 && (
                      <Chip 
                        size="small" 
                        color="error" 
                        label="Over 1 year" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{user.last_access_at}</TableCell>
                  <TableCell>
                    {daysSinceLastAccess}
                    {daysSinceLastAccess > 90 && (
                      <Chip 
                        size="small" 
                        color="error" 
                        label="Over 90 days" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.mfa_enabled ? "Yes" : "No"}
                      color={user.mfa_enabled ? "success" : "default"}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserTable; 