// app/auth/callback/page.tsx
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/todos');
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Verifying your account...</h1>
      <p>If you're not redirected, please try logging in.</p>
    </div>
  );
}
