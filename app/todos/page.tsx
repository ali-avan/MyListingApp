// app/todos/page.tsx
import TodoList from "./TodoList"; // Client component
import {signOut }from "../login/actions"
import { createClient } from "../../utils/supabase/server";
import {redirect} from "next/navigation"

export default async function TodosPage() {

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      redirect("/login");
    }
    const {data:todos}= await supabase
    .from("todos")
    .select("inserted_at", {ascending: false});
  return (
    <main style={{ padding: "2rem" }}>
      <h1>My Todos</h1>
      <form action={signOut}>
        <button type="submit" style={{ marginBottom: "1rem", background: "red", color: "white", padding: "0.5rem 1rem", border:"none" }}>
          Sign Out
        </button>
      </form>

      <TodoList />
    </main>
  );
}
