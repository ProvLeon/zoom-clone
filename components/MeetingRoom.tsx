'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  // CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  // useParticipantViewContext
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

interface WakeLockSentinel extends EventTarget {
  release(): Promise<void>;
}

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('grid');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();


  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  // const ParticipantsUi =

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout groupSize={4} excludeLocalParticipant={false} pageArrowsVisible={true}  />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  // Request a wake lock
  let wakeLock: WakeLockSentinel | null = null;
  const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock was released');
    });
    console.log('Screen Wake Lock is active');
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.name}, ${err.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  }
};

// Call this function when the call starts
requestWakeLock();

// Don't forget to release the wake lock when the call ends
window.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'hidden') {
    await wakeLock.release();
    wakeLock = null;
  }
});

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className={cn("flex size-full max-w-[1000px] items-center",
        )}>
          <CallLayout />
        </div>
        <div
          className={cn('absolute top-0 ml-2 h-full w-[80%] sm:w-auto sm:relative transition-all duration-300 ease-in-out', {
            'show-block ': showParticipants,
            'hidden': !showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-1 px-2">
        <div className='flex'><CallControls onLeave={() => router.push(`/`)} /></div>
        <div className='hidden sm:flex gap-1'>
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-gray-200" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
        </div>
        <div className='sm:hidden'>
          <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {/* {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => ( */}
            <div>
                <DropdownMenuItem>
                <DropdownMenu>
                  <div className="flex items-center">
                    <DropdownMenuTrigger className="flex cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b] hover:text-gray-400">
                      <LayoutList size={20} className="text-white" /> <p className='hover:text-gray-400 ml-7'>Layout</p>
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                    {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                      <div key={index}>
                        <DropdownMenuItem
                          onClick={() =>
                            setLayout(item.toLowerCase() as CallLayoutType)
                          }
                        >
                          {item}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-gray-200" />
                      </div>
                    ))}
                  </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-gray-200" />
                {/* <DropdownMenuItem>
                  <div className='cursor-pointer text-gray-400 rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b]'>
                    <CallStatsButton />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-gray-200" /> */}
                {/* <CallParticipantsList onClose={() => setShowParticipants(false)} /> */}
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                  <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 sm:px-4 sm:py-2 hover:bg-[#4c535b]">
                    <Users size={20} className="text-white" />
                  </div>
                </button>
                <DropdownMenuItem>
                  {!isPersonalRoom && <EndCallButton />}
                </DropdownMenuItem>
              </div>
          </DropdownMenuContent>

          </DropdownMenu>

        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;



