import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AggregateCardProps {
  title: string;
  value: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AggregateCard({ title, value, formatter, className }: AggregateCardProps) {
  const formattedValue = formatter ? formatter(value) : value.toLocaleString();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">{formattedValue}</div>
      </CardContent>
    </Card>
  );
}