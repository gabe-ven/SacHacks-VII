import { supabase } from '@/lib/supabase'

export default async function RecipesPage() {
  const { data, error } = await supabase
    .from('ping')
    .select('*')

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Connection Test</h1>

      {error && (
        <pre style={{ color: 'red' }}>
          Error: {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}