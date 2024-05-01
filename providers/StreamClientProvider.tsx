'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import UserDetails from '@/components/UserDetails';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();
  const [userDetailsString, setUserDetailsString] = useState<string | null>(null);
  useEffect(() => {
    setUserDetailsString(sessionStorage.getItem('userDetails') || null);
  }, []);

  useEffect(() => {
    // if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error('Stream API key is missing');
    const userDetailsString = sessionStorage.getItem('userDetails');
    // console.log(`user object ${user.id} again ${userDetailsString}`);
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString);

      if (userDetails.id && userDetails.id !== user?.id){
      const client = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: user?.id || userDetails.id,
          name: `${userDetails.firstName} (${userDetails.phone})`,
          image: user?.imageUrl,
        },
        tokenProvider: async () => await tokenProvider(userDetails),
      });

      setVideoClient(client);
      console.log(`client ${videoClient}`);
    } else {
      setUserDetailsString(null); // Ensure it's null to trigger the UserDetails component rendering
    }
  }
  }, [user, isLoaded, userDetailsString]);

  if (!videoClient) {
    if (!userDetailsString) {
      return <UserDetails onComplete={() => setUserDetailsString(sessionStorage.getItem('userDetails'))} />;
    }
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
