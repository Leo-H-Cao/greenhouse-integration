"use client";

import React from "react";
import Image from "next/image";
import RoleApplicationPage from "@/components/RoleApplicationPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
      <header className="py-4 px-8 bg-white shadow-md flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Image src="/next.svg" alt="Logo" width={40} height={30} />
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            My Company
          </h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <RoleApplicationPage />
        </div>
      </main>
    </div>
  );
}
