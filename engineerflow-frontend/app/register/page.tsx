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
    throw new Error("Registration failed");
  }

  return res.json();
}