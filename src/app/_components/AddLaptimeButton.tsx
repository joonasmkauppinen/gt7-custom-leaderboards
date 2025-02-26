"use client";

import { useState } from "react";
import { AddLapTimeModal } from "./AddLapTimeModal";

type AddLaptimeButtonProps = {
  sheetName: string;
};

export const AddLaptimeButton = ({ sheetName }: AddLaptimeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="w-full rounded-md border border-info-item-border bg-button py-3 text-base font-semibold text-white"
        onClick={() => setIsModalOpen(true)}
      >
        + Add Lap Time
      </button>
      <AddLapTimeModal
        isOpen={isModalOpen}
        sheetName={sheetName}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
