import { apiFetch } from "@/lib/apiFetch";

export const updateUsername = async ({ username }: { username: string }) => {
  const response = await apiFetch("/users/profile/username", {
    method: "PUT",
    body: JSON.stringify({
      username,
    }),
  });

  return response;
};

export const updateProfileImage = async ({ file }: { file: string }) => {
  const response = await apiFetch("/users/profile/image", {
    method: "PUT",
    body: JSON.stringify({
      file,
    }),
  });

  return response;
};
