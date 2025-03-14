import get from "lodash.get";
export const findLastEducation = (
  searchTerm: string,
  userEducation: any[],
  keys?: string
) => {
  if (!Array.isArray(userEducation) || userEducation.length === 0) {
    return null; // Jika array kosong, kembalikan null
  }

  const educationMapping: Record<string, string | string[]> = {
    SD: "8 - Elementary School",
    "SD 小学": "8 - Elementary School",
    SLTP: "10 - Junior High School",
    "SLTP 中学": "10 - Junior High School",
    SLTA: "9 - Senior High School",
    "SLTA 高学": "9 - Senior High School",
    "D 1": "4 - Diploma 1",
    "D 2": "5 - Diploma 2",
    "D 3": "6 - Diploma 3",
    "D 1/2/3": ["4 - Diploma 1", "5 - Diploma 2", "6 - Diploma 3"], // Cari D1/D2/D3 tertinggi & terbaru
    S1: ["3 - Bachelor", "7 - Diploma 4"], // S1 setara dengan D4
    S2: "2 - Master Degree",
    "S2 研究": "2 - Master Degree",
    S3: "1 - Doctoral / Professor",
  };

  const mappedValue = educationMapping[searchTerm];
  if (!mappedValue) return null;

  let filteredEducations;

  if (Array.isArray(mappedValue)) {
    // Jika "D 1/2/3" atau "S1" (D4)
    filteredEducations = userEducation.filter((edu) =>
      mappedValue.includes(edu.education_level)
    );
    if (filteredEducations.length === 0) return null;

    // Pilih jenjang tertinggi, jika sama maka pilih graduate_year terbaru
    const result = filteredEducations.reduce((highest, current) => {
      const highestIndex = mappedValue.indexOf(highest.education_level);
      const currentIndex = mappedValue.indexOf(current.education_level);

      if (currentIndex > highestIndex) {
        return current;
      }
      if (currentIndex === highestIndex) {
        return current.graduate_year > highest.graduate_year
          ? current
          : highest;
      }
      return highest;
    });

    return keys ? get(result, keys) : result;
  } else {
    // Jika hanya satu jenjang (misalnya SD, SLTP, SLTA, S2, S3)
    filteredEducations = userEducation.filter(
      (edu) => edu.education_level === mappedValue
    );
    if (filteredEducations.length === 0) return null;

    // Pilih graduate_year terbaru
    const result = filteredEducations.reduce((latest, current) =>
      current.graduate_year > latest.graduate_year ? current : latest
    );

    return keys ? get(result, keys) : result;
  }
};
