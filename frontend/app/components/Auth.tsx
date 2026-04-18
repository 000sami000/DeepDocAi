"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function Auth() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="p-3">
      {!isSignedIn ? (
        <div className="flex justify-center items-center">
          <SignInButton mode="modal">
            <button className="bg-white px-3 py-1 text-black rounded cursor-pointer hover:bg-gray-200 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          
      
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-white truncate max-w-[140px]">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <span className="text-xs text-gray-400">
              Signed in
            </span>
          </div>

     
          <UserButton />
        </div>
      )}
    </div>
  );
}