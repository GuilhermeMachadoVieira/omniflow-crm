import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoCardProps {
  title: string;
  data: Array<{
    label: string;
    value: string;
  }>;
}

export function CustomerInfoCard({ title, data }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b last:border-0">
            <span className="text-sm font-medium text-muted-foreground">
              {item.label}
            </span>
            <span className="text-sm font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
