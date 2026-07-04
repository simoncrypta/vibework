"use client";

import { useState } from "react";

/** Small client island: controlled inputs for the home page demo. */
export function HelloForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-base font-normal text-slate-900"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-base font-normal text-slate-900"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
