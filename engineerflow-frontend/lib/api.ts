const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
// ---------- Helper ----------
function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");

  return token ? token.replace(/"/g, "") : null;   
}

// ---------- Login ----------
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();

  // ensure token is saved here (safe)
  localStorage.setItem("token", data.access_token);

  console.log("TOKEN SAVED:", data.access_token);

  return data;
}

// ---------- Get Projects ----------
export async function getProjects() {
  const token = getToken();

  console.log("TOKEN USED:", token);

  if (!token) {
    console.warn("No token found");
    return [];
  }

  const res = await fetch(`${API_URL}/api/v1/projects/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    console.error("Unauthorized - invalid token");
    return [];
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch projects");
  }

  const data = await res.json();

  console.log("API RESPONSE:", data);

  return Array.isArray(data) ? data : [];
}

export async function createProject(name: string, description: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}

export async function registerUser(
  email: string,
  password: string,
  full_name: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        full_name,
      }),
    }
  );

  if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.detail || "Registration failed");
  }

  return res.json();
}