export const labelDocumentType = (value?: string) => {
  switch (value) {
    case "ADMINISTRATIVE_SELECTION":
      return "Administrative";
      break;
    case "TEST":
      return "Test";
      break;
    case "INTERVIEW":
      return "Interview";
      break;
    case "FGD":
      return "FGD";
      break;
    case "SURAT_PENGANTAR_MASUK":
      return "Surat Pengantar Masuk";
      break;
    case "SURAT_IZIN_ORANG_TUA":
      return "Surat Izin Orang Tua";
      break;
    case "FINAL_INTERVIEW":
      return "Final Interview";
      break;

    case "KARYAWAN_TETAP":
      return "Karyawan Tetap";
    case "OFFERING_LETTER":
      return "Offering Letter";
      break;

    case "CONTRACT_DOCUMENT":
      return "Contract Document";
      break;

    case "DOCUMENT_CHECKING":
      return "Document Checking";
      break;

    default:
      return value;
  }
};
