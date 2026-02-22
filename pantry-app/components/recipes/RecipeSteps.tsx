interface Props {
  steps: string[];
}

export default function RecipeSteps({ steps }: Props) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span className="shrink-0 w-7 h-7 rounded-full bg-pantry-green text-pantry-cream text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <p className="text-sm text-foreground/75 leading-relaxed pt-1">{step}</p>
        </li>
      ))}
    </ol>
  );
}
