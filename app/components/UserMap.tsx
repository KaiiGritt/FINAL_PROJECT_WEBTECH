"use client";

import { useRef } from "react";

export default function UserMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-64 rounded border border-secondary transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent"
    >
      <iframe
        title="User Location"
        width="100%"
        height="100%"
        className="rounded"
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15920938.045997173!2d101.49010399999999!3d13.038996899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d8df747424db1%3A0x9ed72c880757e802!2sThailand!5e0!3m2!1sen!2sph!4v1746448052399!5m2!1sen!2sph"
      ></iframe>
    </div>
  );
}
