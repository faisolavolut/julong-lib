import get from "lodash.get";
export const filterMenuByPermission = (menuConfig: any[], permision: any[]) => {
  const userPermissions = permision?.length
    ? permision.map((e) => get(e, "name"))
    : [];
  return menuConfig
    .map((menu) => {
      // Filter children berdasarkan permission user
      const filteredChildren = menu.children?.filter((child: any) =>
        child.permision.some((perm: any) => userPermissions.includes(perm))
      );

      // Periksa apakah menu utama atau salah satu child memiliki permission yang sesuai
      const hasPermission =
        menu.permision.some((perm: any) => userPermissions.includes(perm)) ||
        (filteredChildren && filteredChildren.length > 0);

      // Jika cocok, kembalikan menu dengan children yang sudah difilter
      if (hasPermission) {
        return {
          ...menu,
          children: filteredChildren,
        };
      }
      return null; // Tidak menyertakan menu yang tidak memiliki permission
    })
    .filter((menu) => menu !== null); // Hapus menu yang null
};

export const getFirstMenuWithUrl = (menuConfig: any[]): any | null => {
  for (const menu of menuConfig) {
    // Jika menu memiliki href langsung, kembalikan menu tersebut
    if (menu.href) {
      return menu?.href;
    }

    // Jika menu memiliki children, cari secara rekursif
    if (menu.children) {
      const childWithUrl = getFirstMenuWithUrl(menu.children);
      if (childWithUrl) {
        return childWithUrl;
      }
    }
  }
  // Jika tidak ada menu dengan URL, kembalikan null
  return null;
};
