"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
        <span className="ml-3 text-lg font-medium text-accent">Loading users...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-alertRed text-center mt-6">
        Error loading users: {error}
      </div>
    );

  return (
    <div className="p-6 mx-auto bg-neutralWhite rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 pb-2 text-secondary p-8 mb-5">
        Users List
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 mb-10 px-6 py-6 bg-highlight rounded-lg">
        {users?.map((user) => (
          <li
            key={user.id}
            className="p-6 border border-secondary rounded-xl shadow-md cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-accent active:bg-secondary active:text-neutralWhite animate-fadeIn"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <Link href={`/users/${user.id}`} className="block">
              <p className="font-semibold text-2xl text-primary mb-2">
                {user.name}
              </p>
              <p className="text-accent text-lg bg-secondary rounded-md px-2 py-1 inline-block">
                {`@${user.username}`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
