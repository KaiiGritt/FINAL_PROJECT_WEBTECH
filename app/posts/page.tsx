"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data);
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
    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
        <span className="ml-3 text-lg font-medium text-accent">Loading posts...</span>
      </div>
    );
  if (error)
    return (
      <div className="text-alertRed text-center mt-6">
        Error loading posts: {error}
      </div>
    );

  if (!posts || posts.length === 0)
    return (
      <div className="text-center mt-6 text-secondary">
        No posts available.
      </div>
    );

  return (
    <div className="p-6 mx-auto rounded-lg shadow-lg" >
      <h1 className="text-3xl font-bold mb-8 pb-2 text-secondary p-8 mb-5">
        Posts List
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 mb-10 px-6 py-6 bg-highlight rounded-lg">
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-6 border rounded-xl shadow-md cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-accent active:scale-95 active:shadow-inner active:border-primary active:bg-secondary active:text-neutralWhite animate-fadeIn" style={{ backgroundColor: "var(--color-light)" }}>
            <Link href={`/posts/${post.id}`}>
              <h2 className="font-semibold text-2xl text-primary hover:underline mb-2 active:no-underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-accent text-lg bg-secondary rounded-md px-2 py-1 inline-block">
              {post.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
