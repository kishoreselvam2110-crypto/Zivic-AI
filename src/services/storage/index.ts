import { supabase } from "@/lib/supabase";

export const checkSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("example.supabase.co") || !key || key === "anon-key") {
    return false;
  }
  return true;
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const uploadReportImage = async (
  file: File,
  userId: string
): Promise<string> => {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WEBP images are allowed.");
  }

  // Validate file size (10 MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File is too large. Maximum allowed size is 10 MB.");
  }

  if (checkSupabaseConfig()) {
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("report-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from("report-images")
          .getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      console.warn("Supabase storage upload fallback to base64 data URL:", err);
    }
  }

  // Fallback to local Data URL for seamless demo functionality
  return await readFileAsDataUrl(file);
};
