'use client'

import { PageProps } from '@/.next/types/app/page';
import { EventFormat, findKeyByValue } from '@/helper/enums';
import { useEvents } from '@/store/events'
import { useRouter } from 'next/navigation';
import React from 'react'


type SearchEvent = {
    pageSize: number,
    props: PageProps,
}

const EventFormatFilter = ({ pageSize, props } : SearchEvent) => {
    const { searchEvents, formatToSearch } = useEvents();
    const router = useRouter();

    const pageNumber = props?.searchParams?.page || 1;
    const skip = (pageNumber - 1) * pageSize;

    const handleChange = (format: string) => {
        router.push(`/?page=1`)
        searchEvents({format: format, skip: skip, take: pageSize})
    }

    return (
        <ul className='flex gap-4 overflow-auto py-2 w-auto'>
            {Object.values(EventFormat).map((format) => (
                <li 
                    key={format}
                    className={`px-4 py-2 text-nowrap text-sm rounded-md flex items-center justify-center leading-[100%] cursor-pointer
                        ${formatToSearch?.toUpperCase() == findKeyByValue(format)?.toString() ? 'bg-[var(--blue)] text-white' : 'border border-[var(--blue)]'}
                    `}
                    onClick={() => handleChange(format)}
                >{format}
                </li>
            ))}
        </ul>
    )
}

export default EventFormatFilter
