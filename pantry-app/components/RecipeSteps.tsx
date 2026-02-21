interface RecipeStepsProps {
  steps: string[];
}

export default function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <ol className="list-decimal list-inside space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="text-gray-700">{step}</li>
      ))}
    </ol>
  );
}
