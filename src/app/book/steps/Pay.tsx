import { Table, TR, TH, TD } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ESTIMATED_HOURS } from "../data";
import type { BookingFlow } from "../useBookingFlow";

export function Pay({ flow }: { flow: BookingFlow }) {
  const { pricing, finalProvider } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Complete &amp; pay</h2>
      <Table className="max-w-[420px]">
        <thead>
          <TR>
            <TH>Item</TH>
            <TH className="text-right">Amount</TH>
          </TR>
        </thead>
        <tbody>
          <TR>
            <TD>Call-out fee</TD>
            <TD className="text-right">R{pricing.calloutFee.toFixed(2)}</TD>
          </TR>
          <TR>
            <TD>Labour ({ESTIMATED_HOURS}h)</TD>
            <TD className="text-right">R{pricing.labour}</TD>
          </TR>
          <TR>
            <TD>VAT (15%)</TD>
            <TD className="text-right">R{pricing.vat.toFixed(2)}</TD>
          </TR>
          <TR>
            <TD className="font-semibold text-text">Total</TD>
            <TD className="text-right font-semibold text-text">
              R{pricing.total.toFixed(2)}
            </TD>
          </TR>
        </tbody>
      </Table>
      <Tag variant="outline" className="w-fit">
        {finalProvider?.guaranteeDays}-day workmanship guarantee
      </Tag>
      <Button variant="primary" className="w-fit" onClick={flow.next}>
        Approve &amp; pay R{pricing.total.toFixed(2)}
      </Button>
    </>
  );
}
