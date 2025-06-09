import Image from "next/image";
import React from "react";

export default function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-fit rounded-2xl p-[2px] bg-gradient-to-r from-pink-500 to-fuchsia-500">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="w-10 h-10 rounded-2xl bg-white object-cover"
      />
    </div>
  );
}
