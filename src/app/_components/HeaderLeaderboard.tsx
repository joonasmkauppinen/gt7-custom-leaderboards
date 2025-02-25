"use client";

import { useRouter } from "next/navigation";
import { Header } from "./Header";
import { IconChevronLeft } from "./icons/IconChevronLeft";

export default function HeaderLeaderboard() {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };

  return (
    <Header
      title="Leaderboard"
      headerLeftIcon={<IconChevronLeft />}
      onHeaderLeftClick={navigateBack}
    />
  );
}
