"use client";
import React, { FC } from "react";
import Link from "next/link";
import { Dropdown, Sidebar, TextInput, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import classNames from "classnames";
import { HiAdjustments, HiChartPie, HiCog } from "react-icons/hi";
import isSmallScreen from "@/lib/helpers/is-small-screen";
import { css } from "@emotion/css";
import { FaAngleUp, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Minimize } from "lucide-react";
import { SidebarLinkBetter } from "../ui/link-better";
import { detectCase } from "@/lib/utils/detectCase";
import { Skeleton } from "../ui/Skeleton";
import { useLocal } from "@/lib/utils/use-local";
interface TreeMenuItem {
  title: string;
  href?: string;
  children?: TreeMenuItem[];
  icon?: any;
}

interface TreeMenuProps {
  data: TreeMenuItem[];
  minimaze: () => void;
  mini: boolean;
}

const SidebarTree: React.FC<TreeMenuProps> = ({ data, minimaze, mini }) => {
  const [currentPage, setCurrentPage] = useState("");
  const local = useLocal({
    data: data,
    ready: false as boolean,
  });
  useEffect(() => {
    if (typeof location === "object") {
      const newPage = window.location.pathname;
      setCurrentPage(newPage);
    }
    const run = async () => {
      local.ready = false;
      local.render();

      setTimeout(() => {
        local.ready = true;
        local.render();
      }, 1000);
    };
    if (typeof window === "object") {
      run();
    }
  }, []);

  const isChildActive = (items: TreeMenuItem[]): boolean => {
    return items.some((item) => {
      if (item.href && currentPage.startsWith(item.href)) return true;
      if (item.children) return isChildActive(item.children); // Rekursif
      return false;
    });
  };
  const renderTree = (items: TreeMenuItem[], depth: number = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = item.href && detectCase(currentPage, item.href);
      const isParentActive = hasChildren && isChildActive(item.children!);
      const [isOpen, setIsOpen] = useState(isParentActive);
      useEffect(() => {
        if (isParentActive) {
          setIsOpen(true);
        }
      }, [isParentActive]);
      const itemStyle = {
        paddingLeft: !mini ? `${depth * 16}px` : "0px",
      };
      return (
        <React.Fragment key={item.href || item.title || index}>
          {hasChildren ? (
            <li>
              <div
                className={classNames(
                  " flex-row flex items-center cursor-pointer items-center w-full rounded-lg text-base font-normal text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-row",
                  isParentActive && !depth
                    ? " text-base font-normal text-dark-500 rounded-lg hover:bg-gray-200 group bg-white shadow-md  shadow-[#31367875] hover:!bg-white  transition-all duration-200  dark:bg-gray-700"
                    : " ",
                  mini ? "m-0 flex-grow w-full" : "py-2.5 px-4 ",
                  mini
                    ? css`
                        margin: 0 !important;
                      `
                    : ""
                )}
                onClick={() => {
                  if (mini) {
                    minimaze();
                  }
                  setIsOpen(!isOpen);
                }}
                style={itemStyle}
              >
                <div
                  className={cx(
                    "flex flex-row items-center flex-grow",
                    mini ? "py-2 justify-center  rounded-lg" : " px-3",
                    mini
                      ? isParentActive
                        ? "bg-[#313678]"
                        : "bg-white hover:bg-gray-300 shadow shadow-gray-300"
                      : ""
                  )}
                >
                  {!depth ? (
                    <div
                      className={classNames(
                        " w-8 h-8 rounded-lg text-center flex flex-row items-center justify-center",
                        isParentActive
                          ? "bg-[#313678] text-white active-menu-icon"
                          : "bg-white shadow-lg text-black",
                        !mini
                          ? "mr-1  p-2 shadow-gray-300"
                          : " text-lg shadow-none",
                        mini
                          ? css`
                              background: transparent !important;
                            `
                          : ``
                      )}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    <></>
                  )}

                  {!mini ? (
                    <>
                      <div className="pl-2 flex-grow  text-black text-xs">
                        {item.title}
                      </div>
                      <div className="text-md">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <Sidebar.ItemGroup
                className={classNames(
                  "border-none mt-0",
                  isOpen ? "" : "hidden",
                  mini ? "hidden" : ""
                )}
              >
                {renderTree(item.children!, depth + 1)}
              </Sidebar.ItemGroup>
            </li>
          ) : (
            <li>
              <SidebarLinkBetter
                href={item.href}
                onClick={() => {
                  if (item?.href) setCurrentPage(item.href);
                }}
                className={classNames(
                  " flex-row flex items-center cursor-pointer items-center w-full rounded-lg text-base font-normal text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-row  py-2.5 px-4",
                  isActive
                    ? " py-2.5 px-4 text-base font-normal text-dark-500 rounded-lg  group     shadow-[#31367875]   transition-all duration-200  dark:bg-gray-700"
                    : "",
                  isActive
                    ? !depth
                      ? " bg-white shadow-md hover:bg-gray-200 hover:!bg-white "
                      : "bg-gray-100"
                    : "",
                  css`
                    & > span {
                      white-space: wrap !important;
                    }
                  `,

                  mini ? "px-0 py-2" : ""
                )}
                style={itemStyle} // Terapkan gaya berdasarkan depth
              >
                <div className="flex flex-row items-center">
                  {!depth ? (
                    <div
                      className={classNames(
                        " shadow-gray-300  text-dark-700 w-8 h-8  rounded-lg text-center flex flex-row items-center justify-center shadow-[#313678]",
                        isActive
                          ? "bg-[#313678] text-white"
                          : "bg-white shadow-lg text-black",
                        !mini ? "mr-1  p-2" : " text-lg"
                      )}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    <></>
                  )}
                  {!mini ? (
                    <>
                      <div className="pl-2 text-black text-xs">
                        {item.title}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </SidebarLinkBetter>
            </li>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={classNames("flex h-full lg:!block", {})}>
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        className={classNames("relative bg-white", mini ? "w-20" : "", css``)}
      >
        {/* {!local.ready ? (
          <div
            className={cx(
              "absolute",
              css`
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              `
            )}
          >
            <div className="flex flex-grow flex-row items-center justify-center">
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2">
                  <Skeleton className="h-24 flex-grow" />
                  <Skeleton className="h-24 flex-grow" />
                </div>
                <Skeleton className="h-24 w-[230px]" />
                <div className="flex flex-row gap-x-2">
                  <Skeleton className="h-24 flex-grow" />
                  <Skeleton className="h-24 flex-grow" />
                </div>
                <Skeleton className="h-24 w-[230px]" />
              </div>
            </div>
          </div>
        ) : (
        )} */}

        <div className="w-full h-full relative">
          <div className="flex h-full flex-col justify-between w-full absolute top-0 left-0">
            <Sidebar.Items>
              <Sidebar.ItemGroup
                className={cx(
                  "border-none mt-0",
                  mini ? "flex flex-col gap-y-2" : ""
                )}
              >
                {renderTree(data)}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
const BottomMenu: FC = function () {
  return (
    <div className="flex items-center justify-center gap-x-5">
      <button className="rounded-lg p-2 hover:bg-gray-100">
        <span className="sr-only">Tweaks</span>
        <HiAdjustments className="text-2xl text-gray-500 hover:text-gray-900  " />
      </button>
      <div>
        <Tooltip content="Settings page">
          <a
            href="/users/settings"
            className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="sr-only">Settings page</span>
            <HiCog className="text-2xl text-gray-500 hover:text-gray-900 " />
          </a>
        </Tooltip>
      </div>
      <div>
        <LanguageDropdown />
      </div>
    </div>
  );
};

const LanguageDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
          <span className="sr-only">Current language</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 3900 3900"
            className="h-5 w-5 rounded-full"
          >
            <path fill="#b22234" d="M0 0h7410v3900H0z"></path>
            <path
              d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
              stroke="#fff"
              strokeWidth="300"
            ></path>
            <path fill="#3c3b6e" d="M0 0h2964v2100H0z"></path>
            <g fill="#fff">
              <g id="d">
                <g id="c">
                  <g id="e">
                    <g id="b">
                      <path
                        id="a"
                        d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                      ></path>
                      <use xlinkHref="#a" y="420"></use>
                      <use xlinkHref="#a" y="840"></use>
                      <use xlinkHref="#a" y="1260"></use>
                    </g>
                    <use xlinkHref="#a" y="1680"></use>
                  </g>
                  <use xlinkHref="#b" x="247" y="210"></use>
                </g>
                <use xlinkHref="#c" x="494"></use>
              </g>
              <use xlinkHref="#d" x="988"></use>
              <use xlinkHref="#c" x="1976"></use>
              <use xlinkHref="#e" x="2470"></use>
            </g>
          </svg>
        </span>
      }
    >
      <ul className="py-1" role="none">
        <li>
          <a
            href="#"
            className="block py-2 px-4 text-md text-gray-700 hover:bg-gray-100 "
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-4 w-4 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-us"
                viewBox="0 0 512 512"
              >
                <g fillRule="evenodd">
                  <g strokeWidth="1pt">
                    <path
                      fill="#bd3d44"
                      d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                      transform="scale(3.9385)"
                    />
                    <path
                      fill="#fff"
                      d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                      transform="scale(3.9385)"
                    />
                  </g>
                  <path
                    fill="#192f5d"
                    d="M0 0h98.8v70H0z"
                    transform="scale(3.9385)"
                  />
                  <path
                    fill="#fff"
                    d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                    transform="scale(3.9385)"
                  />
                </g>
              </svg>
              <span className="whitespace-nowrap">English (US)</span>
            </div>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 text-md text-gray-700 hover:bg-gray-100"
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-4 w-4 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-de"
                viewBox="0 0 512 512"
              >
                <path fill="#ffce00" d="M0 341.3h512V512H0z" />
                <path d="M0 0h512v170.7H0z" />
                <path fill="#d00" d="M0 170.7h512v170.6H0z" />
              </svg>
              Deutsch
            </div>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 text-md text-gray-700 hover:bg-gray-100 "
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-4 w-4 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-it"
                viewBox="0 0 512 512"
              >
                <g fillRule="evenodd" strokeWidth="1pt">
                  <path fill="#fff" d="M0 0h512v512H0z" />
                  <path fill="#009246" d="M0 0h170.7v512H0z" />
                  <path fill="#ce2b37" d="M341.3 0H512v512H341.3z" />
                </g>
              </svg>
              Italiano
            </div>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 text-md text-gray-700 hover:bg-gray-100  dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-4 w-4 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                id="flag-icon-css-cn"
                viewBox="0 0 512 512"
              >
                <defs>
                  <path id="a" fill="#ffde00" d="M1-.3L-.7.8 0-1 .6.8-1-.3z" />
                </defs>
                <path fill="#de2910" d="M0 0h512v512H0z" />
                <use
                  width="30"
                  height="20"
                  transform="matrix(76.8 0 0 76.8 128 128)"
                  xlinkHref="#a"
                />
                <use
                  width="30"
                  height="20"
                  transform="rotate(-121 142.6 -47) scale(25.5827)"
                  xlinkHref="#a"
                />
                <use
                  width="30"
                  height="20"
                  transform="rotate(-98.1 198 -82) scale(25.6)"
                  xlinkHref="#a"
                />
                <use
                  width="30"
                  height="20"
                  transform="rotate(-74 272.4 -114) scale(25.6137)"
                  xlinkHref="#a"
                />
                <use
                  width="30"
                  height="20"
                  transform="matrix(16 -19.968 19.968 16 256 230.4)"
                  xlinkHref="#a"
                />
              </svg>
              <span className="whitespace-nowrap">中文 (繁體)</span>
            </div>
          </a>
        </li>
      </ul>
    </Dropdown>
  );
};

export default SidebarTree;
