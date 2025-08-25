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
      <CardHeader className="pt-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2 text-center">
        <div className="text-xl font-bold">{formattedValue}</div>
      </CardContent>
    </Card>
  );
}