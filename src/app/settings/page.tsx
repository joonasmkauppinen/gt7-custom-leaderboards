import { auth } from "@/auth";
import AuthButton from "../_components/AuthButton.server";

export default async function Page() {
  await auth();

  return (
    <main className="flex flex-col self-stretch">
      <h1 className="mb-6 text-3xl font-semibold">Settings</h1>
      <AuthButton />
    </main>
  );
}
