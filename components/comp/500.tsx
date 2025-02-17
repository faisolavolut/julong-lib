import type { FC } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { ButtonLink } from "@/lib/components/ui/button-link";
import { siteurl } from "@/lib/utils/siteurl";

const ServerErrorPage: FC = function () {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <img alt="" src={siteurl("/500.svg")} className="lg:max-w-md" />
      <h1 className="mb-3 w-4/5 text-center text-2xl font-bold dark:text-white md:text-5xl">
        403 Forbidden
      </h1>
      <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">
        Oops! It seems you don’t have the keys to this door. Why not grab a
        coffee while you figure things out? ☕ If you think this is a mistake,
        contact your administrator.
      </p>
      <ButtonLink href={process.env.NEXT_PUBLIC_API_PORTAL}>
        <div className="mr-1 flex items-center gap-x-2">
          <HiChevronLeft className="text-xl" /> Go portal
        </div>
      </ButtonLink>
    </div>
  );
};

export default ServerErrorPage;
