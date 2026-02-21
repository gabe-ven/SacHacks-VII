import Badge from "@/components/ui/Badge";

type Props = {
  inStock: boolean | null;
};

export default function StockBadge({ inStock }: Props) {
  if (inStock === true) {
    return (
      <Badge variant="green" dot aria-label="In stock">
        In stock
      </Badge>
    );
  }

  if (inStock === false) {
    return (
      <Badge variant="tan" dot aria-label="Out of stock">
        Out
      </Badge>
    );
  }

  return (
    <Badge variant="amber" dot aria-label="Stock status unknown">
      Unknown
    </Badge>
  );
}
