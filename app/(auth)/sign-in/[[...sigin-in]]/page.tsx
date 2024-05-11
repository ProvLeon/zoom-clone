'use client'
import { useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [googleToken, setGoogleToken] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signIn', { email, password });
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('userDetails', JSON.stringify(response.data.user));
        window.location.href = '/';
      } else {
        setError('Failed to login');
      }
    } catch (err) {
      const error = err as { response?: { data: { message: string } } }
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const response = await axios.post('/api/googleSignIn', { token: googleToken });
  //     if (response.status === 200) {
  //       sessionStorage.setItem('token', response.data.token);
  //       sessionStorage.setItem('userDetails', JSON.stringify(response.data.user));
  //       window.location.href = '/';
  //     } else {
  //       setError('Failed to login with Google');
  //     }
  //   } catch (err) {
  //     const error = err as { response?: { data: { message: string } } }
  //     setError(error.response?.data?.message || 'An error occurred during Google login');
  //   }
  // };

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <form onSubmit={handleSignIn} className="p-4 border rounded-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign In
        </button>
        {/* <button type="button" onClick={handleGoogleSignIn} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Sign In with Google
        </button> */}
      </form>
    </main>
  );
}
