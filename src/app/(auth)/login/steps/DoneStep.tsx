import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import type { CustomerAuthFlow } from "../useCustomerAuthFlow";

export function DoneStep({ flow }: { flow: CustomerAuthFlow }) {
  return (
    <>
      <Tag variant="accent" className="w-fit">
        Account created
      </Tag>
      <h2 className="text-xl font-medium">Welcome to Need-A, {flow.profFirstName}</h2>
      <p className="text-[13px] text-neutral-400">
        Your profile is set up. You&apos;re ready to book a verified pro.
      </p>
      <Button variant="primary" block onClick={flow.goToApp}>
        Continue to app
      </Button>
    </>
  );
}
