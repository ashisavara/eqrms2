"use client";

import { type Table as TanStackTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Color palette for charts
const COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  accent: 'hsl(var(--chart-3))',
  muted: 'hsl(var(--chart-4))',
  success: 'hsl(var(--chart-5))',
};

interface PieChartProps<TData> {
  table: TanStackTable<TData>;
  aggCol: string;          // Aggregation column (e.g., 'asset_class_name')
  valCol: string;          // Value column (e.g., 'cur_amt')
  title: string;           // Chart title
  description?: string;    // Chart description
  maxItems?: number;       // Limit number of items (default: no limit)
  height?: string;         // Chart height (default: '300px')
}

// ✅ Reusable Pie Chart Component
export function PieChart<TData>({ 
  table, 
  aggCol, 
  valCol, 
  title, 
  description, 
  maxItems,
  height = "300px" 
}: PieChartProps<TData>) {
  const chartData = useMemo(() => {
    const rows = table.getFilteredRowModel().rows;
    const totals: Record<string, number> = {};
    
    rows.forEach(row => {
      const aggValue = String(row.getValue(aggCol) || 'Unknown');
      const numValue = Number(row.getValue(valCol)) || 0;
      totals[aggValue] = (totals[aggValue] || 0) + numValue;
    });
    
    let result = Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Apply maxItems limit if specified
    if (maxItems && result.length > maxItems) {
      result = result.slice(0, maxItems);
    }
    
    return result;
  }, [table.getFilteredRowModel().rows, aggCol, valCol, maxItems]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    const colorKeys = Object.keys(COLORS);
    
    chartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[colorKeys[index % colorKeys.length] as keyof typeof COLORS],
      };
    });
    
    return config;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={`h-[${height}]`}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toFixed(1)}`, 'Value']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}