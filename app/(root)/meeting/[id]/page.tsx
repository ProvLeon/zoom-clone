'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import UserDetails from '@/components/UserDetails';

const MeetingPage = () => {
  const { id } = useParams();
  // const router = useRouter();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userDetailsComplete, setUserDetailsComplete] = useState(false);
  const [userDetailsString, setUserDetailsString] = useState<string | null>(null)

  useEffect(() => {
    setUserDetailsString(sessionStorage.getItem('userDetails') || null);
  }, []);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));
  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  if (!userDetailsComplete && !userDetailsString) {
    return <UserDetails onComplete={() => setUserDetailsComplete(true)} />;
  }

  // if (!isSetupComplete) {
  //   return (
  //     <StreamCall>
  //     <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
  //     </StreamCall>
  //   );
  // }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete && <MeetingSetup setIsSetupComplete={setIsSetupComplete} />}
          {isSetupComplete && <MeetingRoom />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
