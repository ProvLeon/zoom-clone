'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
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

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-1 px-2">
        <div className='flex'><CallControls onLeave={() => router.push(`/`)} /></div>
        <div className='hidden sm:block'>
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
        <CallStatsButton />
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
