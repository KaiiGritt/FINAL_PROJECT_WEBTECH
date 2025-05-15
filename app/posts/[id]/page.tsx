"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostDetailPage(props: PostDetailPageProps) {
  const params = use(props.params);
  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorPost, setErrorPost] = useState<string | null>(null);
  const [errorComments, setErrorComments] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorPost(err.message);
        } else {
          setErrorPost("An unknown error occurred");
        }
      } finally {
        setLoadingPost(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorComments(err.message);
        } else {
          setErrorComments("An unknown error occurred");
        }
      } finally {
        setLoadingComments(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  if (loadingPost) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
      <span className="ml-3 text-lg font-medium text-accent">Loading post...</span>
    </div>
  );

  if (errorPost) return <div className="text-alertRed text-center mt-6">{errorPost}</div>;

  return (
    <main className="min-h-screen bg-neutralWhite py-16 px-12 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-16">
        <article className="bg-primary p-10 rounded-2xl shadow-md">
          <h1 className="text-4xl font-bold text-accent mb-6">{post?.title}</h1>
          <p className="text-secondary text-lg">{post?.body}</p>
        </article>

        <section>
          <h2 className="text-3xl font-bold text-accent mb-8 mt-6">Comments</h2>
          {loadingComments ? (
            <div className="flex justify-center items-center h-40 bg-neutralWhite rounded-3xl shadow-lg">
              <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
              <span className="ml-3 text-lg font-medium text-accent">Loading comments...</span>
            </div>
          ) : errorComments ? (
            <div className="text-alertRed text-center mt-6">{errorComments}</div>
          ) : (
            <ul className="space-y-6">
              {comments.map((comment) => (
                <li key={comment.id} className="p-6 bg-neutralWhite rounded-3xl shadow-md border border-secondary" style={{ backgroundColor: "var(--color-cooment)" }}>
                  <p className="font-semibold text-lg text-accent">{comment.name} <span className="text-sm text-secondary">({comment.email})</span></p>
                  <p className="text-secondary mt-2">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
