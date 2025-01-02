export const getStatus = (
    startDate: string, 
    endDate: string, 
    currentDate: string = new Date().toISOString()
  ): string | null => {
    try {
      // Validasi input tanggal
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return null
      }
  
      // Konversi tanggal ke format YYYY-MM-DD
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(endDate);
      const formattedCurrentDate = formatDateToYYYYMMDD(currentDate);
  
      // Tentukan status
      if (formattedCurrentDate === formattedStartDate) {
        return 'open';
      } else if (formattedCurrentDate > formattedStartDate && formattedCurrentDate <= formattedEndDate) {
        return 'in progress';
      } else if (formattedCurrentDate > formattedEndDate) {
        return 'closed';
      } else {
        return 'pending';
      }
    } catch (error: unknown) {
      // Log error dan kembalikan pesan error standar
      console.error(error);
      return null
    }
  };
  
  export const formatDateToYYYYMMDD = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date provided for formatting.");
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error: unknown) {
      console.error(error);
      throw new Error("Failed to format date.");
    }
  };
  
  export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  