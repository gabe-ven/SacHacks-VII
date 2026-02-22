import Badge from "@/components/ui/Badge";

type Props = {
  stockStatus: "in_stock" | "out_of_stock";
};

export default function StockBadge({ stockStatus }: Props) {
  if (stockStatus === "in_stock") {
    return (
      <Badge variant="green" dot aria-label="In stock">
        In stock
      </Badge>
    );
  }

  return (
    <Badge variant="tan" dot aria-label="Out of stock">
      Out of stock
    </Badge>
  );
}
