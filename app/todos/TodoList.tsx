'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";

type Todo = {
  id: number;
  task: string | null;
  is_complete: boolean | null;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(data || []);
      }
    };

    fetchTodos();
  }, []);

  // Add new todo
  const handleAdd = async () => {
    if (input.trim() === "") return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated", userError?.message);
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({
        task: input,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error.message);
    } else if (data) {
      setTodos((prev) => [...prev, data]);
      setInput("");
    }
  };

  // Delete a todo
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error.message);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  // Toggle completion
  const handleToggle = async (id: number, current: boolean | null) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ is_complete: !current })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating todo:", error.message);
    } else if (data) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_complete: data.is_complete } : todo
        )
      );
    }
  };

  // Update task text
  const handleUpdate = async (id: number) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ task: editingText })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error.message);
    } else if (data) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, task: data.task } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
          style={{ padding: "0.5rem", marginRight: "0.5rem"  }}
        />
        <button onClick={handleAdd} style={{ padding: "0.5rem 1rem",background: "green", border:"none", color:"white" }}>
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ padding: "0.25rem 0", display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={!!todo.is_complete}
              onChange={() => handleToggle(todo.id, todo.is_complete)}
              style={{ marginRight: "0.5rem" }}
            />

            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ marginRight: "0.5rem", flexGrow: 1 }}
                />
                <button
                  onClick={() => handleUpdate(todo.id)}
                  style={{
                    marginRight: "0.5rem",
                    background: "green",
                    color: "white",
                    border: "none",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                  style={{
                    background: "gray",
                    color: "white",
                    border: "none",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    flexGrow: 1,
                    textDecoration: todo.is_complete ? "line-through" : "none",
                  }}
                >
                  {todo.task}
                </span>
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.task ?? "");
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    background: "green",
                    color: "white",
                    border: "none",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  Edit
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                marginLeft: "0.5rem",
                background: "red",
                color: "white",
                border: "none",
                padding: "0.25rem 0.5rem",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
