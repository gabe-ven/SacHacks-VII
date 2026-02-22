interface Props {
  steps: string[];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-pantry-green/15 text-pantry-green text-xs font-semibold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed flex-1">{step}</p>
        </li>
      ))}
    </ol>
  );
}
