import React, { useState } from 'react';
// import { Cross2Icon } from '@radix-ui/react-icons';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import {v4 as uuidv4 } from 'uuid';
interface UserDetailsProps {
  onComplete: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`User Details: ${firstName} ${lastName}, Contact: ${phone}`);
    const id = uuidv4();
    sessionStorage.setItem('userDetails', JSON.stringify({ id, firstName, lastName, phone }));
    onComplete();
  };

  return (
    <TooltipProvider>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#123456', marginBottom: 2 }}>
            Enter Your Details to Join Meeting
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="Name"
              autoComplete="firstName"
              autoFocus
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                       />
            {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            /> */}
            <PhoneInput
              defaultCountry="US"
              international
              value={phone}
              onChange={(value: string | undefined) => setPhone(value || '')}
              required
              style={{ width: '100%', height: 56, marginTop: 16, marginBottom: 8 }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="bg-white text-sm text-gray-700 p-2 rounded shadow-lg">
                Submit your details
              </TooltipContent>
            </Tooltip>
          </form>
        </Box>
      </Container>
    </TooltipProvider>
  );
};

export default UserDetails;
