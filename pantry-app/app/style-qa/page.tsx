"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function StyleQaPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pantry-green">
            Dev only
          </p>
          <h1 className="text-3xl font-bold text-foreground">Style QA</h1>
          <p className="text-sm text-foreground/60">
            Quick cross-platform snapshot for typography, controls, and spacing.
          </p>
        </header>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Typography scale</h2>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <p className="text-base">Body text at base size for line-height parity.</p>
            <p className="text-sm text-foreground/70">Small text sample for metadata and captions.</p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Buttons and inputs</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Search pantry items" />
            <select className="w-full rounded-full border border-pantry-tan bg-white px-4 py-2.5 leading-5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green">
              <option>Category</option>
              <option>Produce</option>
              <option>Dairy</option>
            </select>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="h-4 w-4" />
              Checkbox sample
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="qa-radio" className="h-4 w-4" defaultChecked />
              Radio sample
            </label>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Badges, chips, and spacing</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="green">In Stock</Badge>
            <Badge variant="tan">Pantry Staple</Badge>
            <Badge variant="amber">Gluten Free</Badge>
            <Badge variant="coral">Out of Stock</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4">Card A</div>
            <div className="rounded-xl border border-border bg-surface p-4">Card B</div>
            <div className="rounded-xl border border-border bg-surface p-4">Card C</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
