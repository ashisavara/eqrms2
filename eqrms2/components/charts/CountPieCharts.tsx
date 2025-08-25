"use client";

import { type Table as TanStackTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Color palette for charts
const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  accent: 'hsl(var(--chart-3))',
  muted: 'hsl(var(--chart-4))',
  success: 'hsl(var(--chart-5))',
};

interface CountPieChartProps<TData> {
  // Existing table-based approach (for client-side tables)
  table?: TanStackTable<TData>;
  aggCol?: string;          // Aggregation column (e.g., 'importance', 'lead_progression')
  
  // NEW: Direct data approach (for server-side aggregations)
  data?: Array<{ name: string; value: number }>;
  
  title: string;           // Chart title
  description?: string;    // Chart description
  maxItems?: number;       // Limit number of items (default: no limit)
  countLabel?: string;     // Label for count (e.g., 'leads', 'items', 'records')
}

// ✅ Reusable Count-based Pie Chart Component
export function CountPieChart<TData>({ 
  table, 
  aggCol, 
  data, // NEW: Direct data prop
  title, 
  description, 
  maxItems,
  countLabel = 'items'
}: CountPieChartProps<TData>) {
  const chartData = useMemo(() => {
    // ✅ Use direct data if provided (server-side aggregations)
    if (data) {
      let result = [...data].sort((a, b) => b.value - a.value);
      
      // Apply maxItems limit if specified
      if (maxItems && result.length > maxItems) {
        result = result.slice(0, maxItems);
      }
      
      return result;
    }
    
    // ✅ Fall back to table-based approach (client-side aggregations)
    if (table && aggCol) {
      const rows = table.getFilteredRowModel().rows;
      const counts: Record<string, number> = {};
      
      rows.forEach(row => {
        const aggValue = String(row.getValue(aggCol) || 'Unknown');
        counts[aggValue] = (counts[aggValue] || 0) + 1; // Count instead of sum
      });
      
      let result = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      
      // Apply maxItems limit if specified
      if (maxItems && result.length > maxItems) {
        result = result.slice(0, maxItems);
      }
      
      return result;
    }
    
    // ✅ Return empty array if neither data nor table+aggCol provided
    return [];
  }, [data, table, aggCol, maxItems]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    const colorKeys = Object.keys(CHART_COLORS);
    
    chartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: CHART_COLORS[colorKeys[index % colorKeys.length] as keyof typeof CHART_COLORS],
      };
    });
    
    return config;
  }, [chartData]);

  return (
    <Card className="h-[425px]">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}> 
          <div>
            <RechartsPieChart width={400} height={350}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent className="font-bold text-gray-500" />}
                formatter={(value: number, name: string, props: any) => [`${props.payload.name} (${value} ${countLabel})`, '']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                wrapperStyle={{ paddingTop: '0px' }}
              />
            </RechartsPieChart>
          </div>
         </ChartContainer> 
      </CardContent>
    </Card>
  );
}
