import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <h1 className="font-medium">
        Spee<span className="text-blue-400 bold">Chify</span>
      </h1>
      <button className="flex items-center gap-2 specialBtn px-4 py-2 rounded-lg text-blue-400">
        <p>New</p>
        <i className="fa-regular fa-square-plus"></i>
      </button>
    </header>
  );
}
