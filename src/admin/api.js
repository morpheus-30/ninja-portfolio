/**
 * Admin API client — communicates with /api/admin/* endpoints.
 */

export async function fetchDraft() {
  const res = await fetch("/api/admin/draft", { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch draft: ${res.status}`);
  return res.json();
}

export async function saveDraft(data) {
  const res = await fetch("/api/admin/draft", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to save draft: ${res.status}`);
  return res.json();
}

export async function discardDraft() {
  const res = await fetch("/api/admin/draft", {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to discard draft: ${res.status}`);
  return res.json();
}

export async function publishDraft() {
  const res = await fetch("/api/admin/publish", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Publish failed: ${res.status}`);
  }

  return data;
}
