"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LuSearch } from "react-icons/lu";
import debounce from "lodash.debounce";
import { useCallback } from "react";

export const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.set("page", "1");
      return params.toString();
    },
    [searchParams],
  );

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      router.push(`${pathname}?${createQueryString("search", term)}`);
    }, 500),
    [],
  );

  return (
    <div className="flex w-full gap-4">
      <div className="relative flex h-10 w-full items-center">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <LuSearch />
        </div>
        <input
          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg outline-none"
          placeholder="Search..."
          type="text"
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
