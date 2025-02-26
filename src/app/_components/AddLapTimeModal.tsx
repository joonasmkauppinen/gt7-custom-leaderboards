"use client";

import { Dialog, DialogPanel, Input, type InputProps } from "@headlessui/react";
import { Header } from "./Header";
import { IconClose } from "./icons/IconClose";
import { IconIllustrationCheckeredFlags } from "./icons/IconIllustrationCheckeredFlags";
import { type FC, forwardRef, useEffect, useRef, useState } from "react";
import { millisecondsToGoogleSheetsDuration } from "../helpers/dateFormatHelpers";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type AddLapTimeModalProps = {
  sheetName: string;
  isOpen: boolean;
  onClose: () => void;
};

export const AddLapTimeModal: React.FC<AddLapTimeModalProps> = ({
  sheetName,
  isOpen,
  onClose,
}) => {
  const [driverName, setDriverName] = useState("");
  useEffect(() => {
    const storedDriverName = localStorage.getItem("driverName");
    if (storedDriverName) {
      setDriverName(storedDriverName);
    }
  }, []);

  const [lapTimeMinutes, setLapTimeMinutes] = useState("");
  const [lapTimeSeconds, setLapTimeSeconds] = useState("");
  const [lapTimeMilliSeconds, setLapTimeMilliSeconds] = useState("");

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const millisecondsRef = useRef<HTMLInputElement>(null);

  const mutation = api.leaderboard.postLapTime.useMutation();

  const lapTimeInMs =
    parseInt(lapTimeMinutes) * 60 * 1000 +
    parseInt(lapTimeSeconds) * 1000 +
    parseInt(lapTimeMilliSeconds);

  const isValid =
    typeof lapTimeInMs === "number" &&
    !isNaN(lapTimeInMs) &&
    driverName.length > 0;

  useEffect(() => {
    if (isOpen) {
      setLapTimeMinutes("");
      setLapTimeSeconds("");
      setLapTimeMilliSeconds("");
    }
  }, [isOpen]);

  const handleMinutesChange = (value: string) => {
    setLapTimeMinutes(value);
    if (value.length === 2) {
      secondsRef.current?.focus();
    }
  };

  const handleSecondsChange = (value: string) => {
    if (parseInt(value) > 59) {
      setLapTimeSeconds("59");
    } else {
      setLapTimeSeconds(value);
    }

    if (value.length === 0) {
      minutesRef.current?.focus();
    }

    if (value.length === 2) {
      millisecondsRef.current?.focus();
    }
  };

  const handleMillisecondsChange = (value: string) => {
    setLapTimeMilliSeconds(value);
    if (value.length === 0) {
      secondsRef.current?.focus();
    }
  };

  const handleSubmitPress = () => {
    const googleSheetsDurationFormat =
      millisecondsToGoogleSheetsDuration(lapTimeInMs);
    const dateAdded = format(new Date().toISOString(), "yyyy-MM-dd");

    console.log({
      driverName,
      lapTimeInMs,
      googleSheetsDurationFormat,
      dateAdded,
    });

    mutation.mutate({
      sheetName,
      driverName,
      laptimeGoogleSheetsDuration: googleSheetsDurationFormat,
      dateAdded,
      laptimeInMs: lapTimeInMs.toString(),
    });
  };

  const router = useRouter();

  useEffect(() => {
    if (mutation.status === "success") {
      // Reload page to update leaderboard
      router.refresh();
      onClose();
      mutation.reset();
    }
  }, [mutation, mutation.status, onClose, router]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center">
        <DialogPanel className="flex h-screen w-screen flex-col bg-gray-900">
          <Header
            title="Add New Lap Time"
            headerLeftIcon={<IconClose />}
            onHeaderLeftClick={onClose}
          />

          {/* CHECKERED FLAGS ILLUSTRATION */}
          <div className="flex justify-center py-16">
            <IconIllustrationCheckeredFlags />
          </div>

          {/* DRIVER NAME INPUT */}
          <InputLabel>Driver Name</InputLabel>
          <BaseInput
            disabled={mutation.status === "pending"}
            className="mx-4 mb-6"
            value={driverName}
            placeholder="Enter driver name"
            onChange={({ target }) => setDriverName(target.value)}
            onBlur={() => localStorage.setItem("driverName", driverName)}
          />

          {/* LAP TIME INPUT */}
          <InputLabel>Lap Time</InputLabel>
          <p className="m-0 mx-4 mb-3 text-sm text-subtitle">
            Include leading zeros when entering lap time.
          </p>

          <div className="mx-4 mb-6 flex flex-row items-center justify-center">
            <LapTimeInput
              disabled={mutation.status === "pending"}
              ref={minutesRef}
              value={lapTimeMinutes}
              placeholder="00"
              onChange={handleMinutesChange}
            />
            <span className="font-mono text-4xl">:</span>
            <LapTimeInput
              disabled={mutation.status === "pending"}
              ref={secondsRef}
              value={lapTimeSeconds}
              placeholder="00"
              onChange={handleSecondsChange}
            />
            <span className="font-mono text-4xl">.</span>
            <LapTimeInput
              disabled={mutation.status === "pending"}
              ref={millisecondsRef}
              value={lapTimeMilliSeconds}
              placeholder="000"
              onChange={handleMillisecondsChange}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={
              !isValid ||
              mutation.status === "pending" ||
              mutation.status === "success"
            }
            className="mx-4 mt-6 rounded-lg bg-white py-3 text-base font-semibold text-black disabled:opacity-30"
            onClick={handleSubmitPress}
          >
            Submit New Lap Time
          </button>

          {/* SUBMITTING LOADER */}
          {
            <div className="mt-6 flex justify-center">
              {mutation.status === "pending" && (
                <p className="text-sm font-semibold text-white">
                  Submitting...
                </p>
              )}
              {mutation.status === "error" && (
                <p className="text-sm font-semibold text-red-400">
                  An error occurred. Please try again.
                </p>
              )}
            </div>
          }
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const InputLabel: FC<{ children: string }> = ({ children }) => {
  return (
    <label className="mx-4 mb-3 text-lg font-semibold leading-4">
      {children}
    </label>
  );
};

const BaseInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "className"> & { className?: string }
>(({ className, ...inputProps }, ref) => {
  return (
    <Input
      {...inputProps}
      className={`flex rounded-lg border border-input-border bg-input-bg p-3 ${className}`}
      ref={ref}
    />
  );
});

BaseInput.displayName = "BaseInput";

const LapTimeInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "className" | "onChange"> & {
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  }
>(({ value, placeholder, onChange, ...inputProps }, ref) => {
  return (
    <BaseInput
      type="tel"
      className="font-mono text-4xl"
      size={placeholder?.length}
      maxLength={placeholder?.length}
      placeholder={placeholder}
      value={value}
      onChange={({ target }) => onChange(target.value)}
      ref={ref}
      {...inputProps}
    />
  );
});

LapTimeInput.displayName = "LapTimeInput";
