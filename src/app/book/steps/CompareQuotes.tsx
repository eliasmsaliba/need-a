import { PROVIDERS } from "../data";
import { Table, TR, TH, TD } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import type { BookingFlow } from "../useBookingFlow";

export function CompareQuotes({ flow }: { flow: BookingFlow }) {
  const rows = flow.state.selectedProviders
    .map((id) => PROVIDERS.find((p) => p.id === id))
    .filter((p): p is (typeof PROVIDERS)[number] => Boolean(p));

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-medium">Compare quotes</h2>
        <p className="text-neutral-400 text-[13px]">
          Standardised line items across your chosen pros.
        </p>
      </div>
      <Table>
        <thead>
          <TR>
            <TH>Pro</TH>
            <TH>Labour</TH>
            <TH>Materials</TH>
            <TH>Days</TH>
            <TH>Guarantee</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {rows.map((p) => (
            <TR key={p.id}>
              <TD>{p.name}</TD>
              <TD>R{Math.round(p.hours * p.rate)}</TD>
              <TD>R{p.materials}</TD>
              <TD>{p.hours}</TD>
              <TD>{p.guaranteeDays}d</TD>
              <TD>
                <Button variant="secondary" onClick={() => flow.chooseQuote(p.id)}>
                  Choose this quote
                </Button>
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </>
  );
}
