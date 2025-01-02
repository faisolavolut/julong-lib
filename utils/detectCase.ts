export const detectCase = (url: string, target: string): boolean => {
  // Buat regex untuk mendeteksi target dan sub-path-nya
  const regex = new RegExp(`^${target}(?:/|$)`);
  return regex.test(url);
};
