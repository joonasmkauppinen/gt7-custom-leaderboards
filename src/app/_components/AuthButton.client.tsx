"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "@/auth/helpers";

export default function AuthButton() {
  const session = useSession();

  return session?.data?.user ? (
    <button
      className="rounded border border-input-border bg-button p-2 text-white"
      onClick={async () => {
        await signOut({ redirectTo: "/" });
      }}
    >
      {session.data?.user?.name} : Sign Out
    </button>
  ) : (
    <button onClick={async () => await signIn()}>Sign In</button>
  );
}
