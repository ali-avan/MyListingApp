import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import LoginForm from "./LoginForm"; // Client Component

export default async function Login({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/todos");
  }
  const message = searchParams?.message || "";

  return <LoginForm message={message} />;
}
