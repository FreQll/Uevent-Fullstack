'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const GoogleButton = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    return (
        <button onClick={() => signIn('google', {callbackUrl})} className='py-[8px] px-[15px] rounded-md border border-gray-600 text-sm w-[100%]'>
            Continue with Google
        </button>
    )
}

export default GoogleButton
