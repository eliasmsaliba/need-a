"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { DAYS } from "../login/data";
import { updateMyAvailabilityAction } from "../actions";
import type { ProviderProfileData } from "../types";

const STATUS_LABEL: Record<ProviderProfileData["status"], string> = {
  pending_verification: "Pending verification",
  active: "Active",
  suspended: "Suspended",
};

const STATUS_VARIANT: Record<ProviderProfileData["status"], "accent" | "neutral" | "outline"> = {
  pending_verification: "outline",
  active: "accent",
  suspended: "neutral",
};

export function Business({ profile }: { profile: ProviderProfileData }) {
  const [selectedDays, setSelectedDays] = useState(profile.selectedDays);
  const [startTime, setStartTime] = useState(profile.startTime);
  const [endTime, setEndTime] = useState(profile.endTime);
  const [hourlyRate, setHourlyRate] = useState(profile.hourlyRate);
  const [calloutFee, setCalloutFee] = useState(profile.calloutFee);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function markDirty() {
    setSaved(false);
  }

  function toggleDay(day: string) {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    markDirty();
  }

  async function save() {
    setSaving(true);
    await updateMyAvailabilityAction({ selectedDays, startTime, endTime, hourlyRate, calloutFee });
    setSaving(false);
    setSaved(true);
  }

  return (
    <>
      <Card className="p-5 gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">{profile.bizName}</span>
          <Tag variant={STATUS_VARIANT[profile.status]}>{STATUS_LABEL[profile.status]}</Tag>
        </div>
        {profile.bizTradingName && (
          <span className="text-sm text-neutral-400">{profile.bizTradingName}</span>
        )}
        <div className="flex gap-2 flex-wrap mt-1">
          {profile.selectedCategories.map((c) => (
            <Tag key={c} variant="neutral">
              {c}
            </Tag>
          ))}
        </div>
        <span className="text-[13px] text-neutral-400">
          {profile.serviceRadius}km service radius · {profile.guaranteeDays}-day guarantee
        </span>
      </Card>

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">Availability &amp; rates</h2>
        <p className="text-[13px] text-neutral-400">Changes apply to new bookings immediately.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {DAYS.map((day) => (
          <ChipToggle key={day} label={day} active={selectedDays.includes(day)} onToggle={() => toggleDay(day)} />
        ))}
      </div>
      <div className="flex gap-5 max-w-[420px]">
        <Field label="Start time" className="flex-1">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              markDirty();
            }}
          />
        </Field>
        <Field label="End time" className="flex-1">
          <Input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              markDirty();
            }}
          />
        </Field>
      </div>
      <div className="flex gap-5 max-w-[420px]">
        <Field label="Hourly rate (R)" className="flex-1">
          <Input
            type="number"
            value={hourlyRate}
            onChange={(e) => {
              setHourlyRate(Number(e.target.value));
              markDirty();
            }}
          />
        </Field>
        <Field label="Call-out fee (R)" className="flex-1">
          <Input
            type="number"
            value={calloutFee}
            onChange={(e) => {
              setCalloutFee(Number(e.target.value));
              markDirty();
            }}
          />
        </Field>
      </div>
      <Button variant="primary" className="w-fit" disabled={saving} onClick={save}>
        {saved ? "Saved" : "Save changes"}
      </Button>
    </>
  );
}
