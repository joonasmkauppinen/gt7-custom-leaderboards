"use client";

import { Dialog, DialogPanel, Input, type InputProps } from "@headlessui/react";
import { Header } from "./Header";
import { IconClose } from "./icons/IconClose";
import { IconIllustrationCheckeredFlags } from "./icons/IconIllustrationCheckeredFlags";
import { type FC, forwardRef, useEffect, useRef, useState } from "react";

type AddLapTimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddLapTimeModal: React.FC<AddLapTimeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const storedDriverName = localStorage.getItem("driverName");

  const [driverName, setDriverName] = useState(storedDriverName ?? "");
  const [lapTimeMinutes, setLapTimeMinutes] = useState("");
  const [lapTimeSeconds, setLapTimeSeconds] = useState("");
  const [lapTimeMilliSeconds, setLapTimeMilliSeconds] = useState("");

  const lapTimeInMs =
    parseInt(lapTimeMinutes) * 60 * 1000 +
    parseInt(lapTimeSeconds) * 1000 +
    parseInt(lapTimeMilliSeconds);

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const millisecondsRef = useRef<HTMLInputElement>(null);

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
    setLapTimeSeconds(value);

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

          <div className="mx-4 flex flex-row items-center justify-center">
            <LapTimeInput
              ref={minutesRef}
              value={lapTimeMinutes}
              placeholder="00"
              onChange={handleMinutesChange}
            />
            <span className="font-mono text-5xl">:</span>
            <LapTimeInput
              ref={secondsRef}
              value={lapTimeSeconds}
              placeholder="00"
              onChange={handleSecondsChange}
            />
            <span className="font-mono text-5xl">.</span>
            <LapTimeInput
              ref={millisecondsRef}
              value={lapTimeMilliSeconds}
              placeholder="000"
              onChange={handleMillisecondsChange}
            />
          </div>

          <p className="m-0 mx-4 mt-3 text-sm text-subtitle">
            Lap time in ms: {lapTimeInMs}
          </p>

          {/* SUBMIT BUTTON */}
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
      className={`bg-input-bg border-input-border flex rounded-lg border p-3 ${className}`}
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
      className="font-mono text-5xl"
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
