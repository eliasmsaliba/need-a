import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { CustomerAuthFlow } from "../useCustomerAuthFlow";

const NOTIF_CHANNELS = [
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
  { key: "push", label: "Push notifications" },
] as const;

export function ProfileStep({ flow }: { flow: CustomerAuthFlow }) {
  const { state, patch, dispatch, profileDisabled, submitProfile } = flow;

  return (
    <>
      <h2 className="text-xl font-medium">Complete your profile</h2>

      <div className="flex gap-4 items-center">
        <ImageSlot placeholder="Photo" shape="circle" className="w-[72px] h-[72px]" />
        <span className="text-xs text-neutral-400">Add a profile photo (optional)</span>
      </div>

      <Field label="Full name">
        <Input value={state.profName} onChange={(e) => patch({ profName: e.target.value })} />
      </Field>
      <Field label="Phone">
        <Input value={state.profPhone} onChange={(e) => patch({ profPhone: e.target.value })} />
      </Field>

      <Field label="Home addresses" className="flex flex-col gap-2">
        {state.addresses.map((a, i) => (
          <div
            key={`${a.label}-${i}`}
            className="flex justify-between items-center py-2 px-2.5 border border-neutral-800 rounded-md"
          >
            <span className="text-[13px]">
              {a.label} · {a.text}
            </span>
            <Button variant="ghost" onClick={() => dispatch({ type: "REMOVE_ADDRESS", index: i })}>
              Remove
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Label (e.g. Home)"
            value={state.newAddrLabel}
            onChange={(e) => patch({ newAddrLabel: e.target.value })}
            className="w-[140px]"
          />
          <Input
            placeholder="Address"
            value={state.newAddrText}
            onChange={(e) => patch({ newAddrText: e.target.value })}
            className="flex-1"
          />
          <Button variant="secondary" onClick={() => dispatch({ type: "ADD_ADDRESS" })}>
            Add
          </Button>
        </div>
      </Field>

      <Field label="Payment method" className="flex flex-col gap-1.5">
        <SegmentedControl
          name="payment"
          value={state.payment}
          onChange={(v) => patch({ payment: v })}
          options={[
            { value: "card", label: "Card" },
            { value: "eft", label: "Instant EFT" },
          ]}
        />
      </Field>
      {state.payment === "card" ? (
        <div className="flex gap-2.5">
          <Input
            placeholder="Card number"
            value={state.cardNumber}
            onChange={(e) => patch({ cardNumber: e.target.value })}
            className="flex-[2]"
          />
          <Input
            placeholder="MM/YY"
            value={state.cardExpiry}
            onChange={(e) => patch({ cardExpiry: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="CVC"
            value={state.cardCvc}
            onChange={(e) => patch({ cardCvc: e.target.value })}
            className="flex-1"
          />
        </div>
      ) : (
        <p className="text-[12.5px] text-neutral-400">
          You&apos;ll approve payment via your banking app at checkout.
        </p>
      )}

      <Field label="Notification preferences" className="flex flex-col gap-2">
        {NOTIF_CHANNELS.map((n) => (
          <div key={n.key} className="flex justify-between items-center">
            <span className="text-[13px]">{n.label}</span>
            <SegmentedControl
              name={`notif-${n.key}`}
              value={state.notif[n.key] ? "on" : "off"}
              onChange={(v) => dispatch({ type: "TOGGLE_NOTIF", channel: n.key, value: v === "on" })}
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
              ]}
            />
          </div>
        ))}
      </Field>

      <Button variant="primary" block disabled={profileDisabled || state.submitting} onClick={submitProfile}>
        Create account
      </Button>
    </>
  );
}
