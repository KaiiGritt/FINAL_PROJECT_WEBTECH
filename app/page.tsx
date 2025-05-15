"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
          fetch("https://jsonplaceholder.typicode.com/comments"),
        ]);
        if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data");
        }
        const users = await usersRes.json();
        const posts = await postsRes.json();
        const comments = await commentsRes.json();

        setUserCount(users.length);
        setPostCount(posts.length);
        setCommentCount(comments.length);
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
    fetchCounts();
  }, []);

  const chartOptions = {
    chart: {
      id: "basic-bar",
      background: 'rgb(199, 219, 230)', // paleBlue background for chart
    },
    xaxis: {
      categories: ["Users", "Posts", "Comments"],
      labels: {
        style: {
          colors: ['rgb(7, 17, 8)', 'rgb(7, 17, 8)', 'rgb(7, 17, 8)'], // darkGreen labels
          fontWeight: 'bold',
        }
      }
    },
    colors: ['rgb(54, 70, 82)', 'rgb(191, 177, 193)', 'rgb(181, 190, 198)'], // slateGray, lavenderGray, lightGray bars
    plotOptions: {
      bar: {
        borderRadius: 4,
      }
    },
    dataLabels: {
      style: {
        colors: ['rgb(7, 17, 8)'], // darkGreen data labels
      }
    },
  };

  const chartSeries = [
    {
      name: "Count",
      data: [userCount, postCount, commentCount],
    },
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin inline-block w-10 h-10 border-4 rounded-full border-primary border-t-transparent"></div>
      <span className="ml-3 text-lg font-medium text-accent">Loading dashboard...</span>
    </div>
  );
  if (error) return <div className="text-red-600 text-center mt-6">Error loading dashboard: {error}</div>;

  return (
    <div className="flex min-h-screen bg-paleBlue">
      {/* Main content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto space-y-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mb-8 text-center text-accent p-5 text-neutralWhite">Dashboard</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
      </main>
    </div>
  );
}
