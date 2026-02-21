import Badge from "@/components/ui/Badge";

type Props = {
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

export default function StockBadge({ stockStatus }: Props) {
  if (stockStatus === "in_stock") {
    return (
      <Badge variant="green" dot aria-label="In stock">
        In stock
      </Badge>
    );
  }

  if (stockStatus === "low_stock") {
    return (
      <Badge variant="amber" dot aria-label="Low stock">
        Low stock
      </Badge>
    );
  }

  return (
    <Badge variant="tan" dot aria-label="Out of stock">
      Out of stock
    </Badge>
  );
}
