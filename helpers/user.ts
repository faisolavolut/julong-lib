import api from "../utils/axios";
import { userRoleMe } from "../utils/getAccess";

export const userToken = async () => {
  const user = localStorage.getItem("user");
  if (user) {
    const w = window as any;
    w.user = JSON.parse(user);
  } else {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_PORTAL}/api/check-jwt-token`
      );
      const jwt = res.data.data;
      console.log({ jwt });
      if (!jwt) return;
      try {
        await api.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/cookies", {
          token: jwt,
        });
        const user = await api.get(
          `${process.env.NEXT_PUBLIC_API_PORTAL}/api/users/me`
        );
        const us = user.data.data;
        console.log({ us });
        if (us) {
          localStorage.setItem("user", JSON.stringify(user.data.data));
          const roles = await userRoleMe();
        }
      } catch (e) {}
    } catch (ex) {}
  }
};
