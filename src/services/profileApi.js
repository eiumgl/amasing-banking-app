const PROFILE_URL = "https://6aedfe89a677fe0fc14faff5.mockapi.io/users/1";

function toAppProfile(record) {
  return {
    name: record.FullName ?? record.name ?? "",
    email: record.Email ?? record.email ?? "",
    phone: record.Phone ?? record.phone ?? "",
    address: record.Address ?? record.address ?? "",
  };
}

export async function getProfile() {
  const response = await fetch(PROFILE_URL);

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `MockAPI request failed (${response.status}).`);
  }

  return toAppProfile(await response.json());
}
