import { PageProps } from "@/.next/types/app/page";
import { EventType } from "@/helper/types";
import { useEvents } from "@/store/events";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import searchIcon from '@/public/search-svgrepo-com.svg'
import Image from "next/image";

type SearchEvent = {
  pageSize: number,
  props: PageProps
}

const SearchEvent = ({ pageSize, props } : SearchEvent) => {
  const { searchEvents } = useEvents();
  const [name, setName] = useState("");
  const router = useRouter();
  const [searchActive, setSearchActive] = useState(false)

  const take = pageSize;
  const pageNumber = props?.searchParams?.page || 1;
  const skip = (pageNumber - 1) * take;

  const searchEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    router.push(`/?page=1`)
    searchEvents({ name: e.target.value, take, skip });
  };

  return (
    <form className={`flex gap-2 ${searchActive && 'border-b'} border-gray-500 px-2 py-1`}>
      <Image
        src={searchIcon}
        alt="search"
        className="w-[20px] h-[20px] cursor-pointer"
        onClick={() => setSearchActive(searchActive => !searchActive)}
      />
      {searchActive && (
        <input
          onChange={(e) => searchEvent(e)}
          name="search"
          value={name}
          autoComplete="off"
          className="outline-none"
        />
      )}
    </form>
  );
};

export default SearchEvent;
