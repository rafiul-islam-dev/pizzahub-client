import api from "@/lib/axios";

export async function getProfile() {
  const response = await api.get("/profile/me");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.patch("/profile/me", payload);
  return response.data;
}

export async function uploadImage(file) {
  const reader = new FileReader();

  const base64 = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await api.post("/upload/image", {
    image: base64,
  });

  return response.data;
}