interface Props {
  steps: string[];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-baseline">
          <span className="shrink-0 w-7 h-7 rounded-full bg-pantry-green/15 text-pantry-green text-sm font-semibold flex items-center justify-center leading-none">
            {i + 1}
          </span>
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed flex-1">{step}</p>
        </li>
      ))}
    </ol>
  );
}
