interface Props {
  steps: string[];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-5">
          <span className="shrink-0 w-9 h-9 rounded-full bg-pantry-green/15 text-pantry-green text-sm font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed pt-1 flex-1">{step}</p>
        </li>
      ))}
    </ol>
  );
}
