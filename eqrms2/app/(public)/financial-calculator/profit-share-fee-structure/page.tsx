"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FUND_RETURNS = [0, 10, 15, 20, 25, 30] as const;

type OptionInputs = { fixed: number; profitShare: number; hurdle: number };

function profitSharingPct(
  fundReturnPct: number,
  profitSharePct: number,
  hurdlePct: number,
  catchUp: boolean
): number {
  if (catchUp) {
    return (profitSharePct / 100) * fundReturnPct;
  }
  const excess = Math.max(0, fundReturnPct - hurdlePct);
  return (profitSharePct / 100) * excess;
}

export default function FeeStructureComparisonPage() {
  const [opt1, setOpt1] = useState<OptionInputs>({
    fixed: 2.5,
    profitShare: 0,
    hurdle: 0,
  });
  const [opt2, setOpt2] = useState<OptionInputs>({
    fixed: 1.2,
    profitShare: 20,
    hurdle: 10,
  });
  const [opt3, setOpt3] = useState<OptionInputs>({
    fixed: 1.5,
    profitShare: 20,
    hurdle: 10,
  });
  const [catchUp1, setCatchUp1] = useState(false);
  const [catchUp2, setCatchUp2] = useState(false);
  const [catchUp3, setCatchUp3] = useState(false);

  const tableRows = useMemo(() => {
    const options = [
      { ...opt1, catchUp: catchUp1 },
      { ...opt2, catchUp: catchUp2 },
      { ...opt3, catchUp: catchUp3 },
    ] as const;
    return FUND_RETURNS.map((fundReturn) => {
      const row: {
        fundReturn: number;
        opt1: { fixed: number; profitSharing: number; total: number };
        opt2: { fixed: number; profitSharing: number; total: number };
        opt3: { fixed: number; profitSharing: number; total: number };
      } = {
        fundReturn,
        opt1: { fixed: 0, profitSharing: 0, total: 0 },
        opt2: { fixed: 0, profitSharing: 0, total: 0 },
        opt3: { fixed: 0, profitSharing: 0, total: 0 },
      };
      options.forEach((opt, i) => {
        const key = i === 0 ? "opt1" : i === 1 ? "opt2" : "opt3";
        const fixed = opt.fixed;
        const profitSharing = profitSharingPct(
          fundReturn,
          opt.profitShare,
          opt.hurdle,
          opt.catchUp
        );
        row[key] = {
          fixed,
          profitSharing,
          total: fixed + profitSharing,
        };
      });
      return row;
    });
  }, [opt1, opt2, opt3, catchUp1, catchUp2, catchUp3]);

  const updateOpt = (
    setter: React.Dispatch<React.SetStateAction<OptionInputs>>,
    field: keyof OptionInputs,
    value: number
  ) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <PageTitle
        title="Comparison of Fee Structure"
        caption="Compare total fees under three fee structures across different fund return scenarios."
      />
      <div className="p-5 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="ime-grid-3col gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">OPTION 1</h3>
                <div className="space-y-2">
                  <Label>Fixed Fees (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt1.fixed}
                    onChange={(e) =>
                      updateOpt(setOpt1, "fixed", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit Share (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt1.profitShare}
                    onChange={(e) =>
                      updateOpt(
                        setOpt1,
                        "profitShare",
                        Number(e.target.value) ?? 0
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hurdle Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt1.hurdle}
                    onChange={(e) =>
                      updateOpt(setOpt1, "hurdle", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    id="catch-up-1"
                    checked={catchUp1}
                    onCheckedChange={setCatchUp1}
                  />
                  <Label htmlFor="catch-up-1" className="cursor-pointer text-xs">
                    Catch-up clause
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm">OPTION 2</h3>
                <div className="space-y-2">
                  <Label>Fixed Fees (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt2.fixed}
                    onChange={(e) =>
                      updateOpt(setOpt2, "fixed", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit Share (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt2.profitShare}
                    onChange={(e) =>
                      updateOpt(
                        setOpt2,
                        "profitShare",
                        Number(e.target.value) ?? 0
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hurdle Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt2.hurdle}
                    onChange={(e) =>
                      updateOpt(setOpt2, "hurdle", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    id="catch-up-2"
                    checked={catchUp2}
                    onCheckedChange={setCatchUp2}
                  />
                  <Label htmlFor="catch-up-2" className="cursor-pointer text-xs">
                    Catch-up clause
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm">OPTION 3</h3>
                <div className="space-y-2">
                  <Label>Fixed Fees (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt3.fixed}
                    onChange={(e) =>
                      updateOpt(setOpt3, "fixed", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit Share (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt3.profitShare}
                    onChange={(e) =>
                      updateOpt(
                        setOpt3,
                        "profitShare",
                        Number(e.target.value) ?? 0
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hurdle Rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={opt3.hurdle}
                    onChange={(e) =>
                      updateOpt(setOpt3, "hurdle", Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    id="catch-up-3"
                    checked={catchUp3}
                    onCheckedChange={setCatchUp3}
                  />
                  <Label htmlFor="catch-up-3" className="cursor-pointer text-xs">
                    Catch-up clause
                  </Label>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2 border-t">
              Catch-up on: profit share on total returns. Catch-up off: profit
              share on returns above hurdle only.
            </p>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Fee Structure under Different Fund Return Calculations
          </h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-semibold p-3">Fund Return</th>
                  <th className="text-right font-semibold p-3">(1) Fixed Fee</th>
                  <th className="text-right font-semibold p-3">
                    (1) Profit Sharing
                  </th>
                  <th className="text-right font-semibold p-3 bg-gray-200">(1) Total Fee</th>
                  <th className="text-right font-semibold p-3">(2) Fixed Fee</th>
                  <th className="text-right font-semibold p-3">
                    (2) Profit Sharing
                  </th>
                  <th className="text-right font-semibold p-3 bg-gray-200">(2) Total Fee</th>
                  <th className="text-right font-semibold p-3">(3) Fixed Fee</th>
                  <th className="text-right font-semibold p-3">
                    (3) Profit Sharing
                  </th>
                  <th className="text-right font-semibold p-3 bg-gray-200">(3) Total Fee</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.fundReturn} className="border-b">
                    <td className="p-3">{row.fundReturn}%</td>
                    <td className="text-right p-3">
                      {row.opt1.fixed.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">
                      {row.opt1.profitSharing.toFixed(1)}%
                    </td>
                    <td className="text-right p-3 font-semibold bg-gray-200">
                      {row.opt1.total.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">
                      {row.opt2.fixed.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">
                      {row.opt2.profitSharing.toFixed(1)}%
                    </td>
                    <td className="text-right p-3 font-semibold bg-gray-200">
                      {row.opt2.total.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">
                      {row.opt3.fixed.toFixed(1)}%
                    </td>
                    <td className="text-right p-3">
                      {row.opt3.profitSharing.toFixed(1)}%
                    </td>
                    <td className="text-right p-3 font-semibold bg-gray-200">
                      {row.opt3.total.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
