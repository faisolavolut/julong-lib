"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const TabSlider: React.FC<any> = ({
  children,
  className,
  disabledPagination,
}) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({});

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
  }, [emblaApi]);
  const wrapper = useRef<HTMLDivElement>(null);
  const item = useRef<HTMLDivElement>(null);
  const [widthWrapper, setWidthWrapper] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (wrapper.current) {
      setWidthWrapper(wrapper?.current?.clientWidth);
      setTimeout(() => {
        setReady(true);
      }, 1000);
    }
  }, [wrapper]);
  useEffect(() => {
    if (item.current) {
      if (item.current.scrollWidth > widthWrapper) {
        setIsScroll(true);
      }
    }
  }, [item.current]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect(); // Initialize state
  }, [emblaApi, onSelect]);
  return (
    <div className="flex flex-grow flex-row w-full">
      <div
        className={cx(
          "relative flex flex-row items-center w-full pt-2",
          className
        )}
        // ref={containerRef}
      >
        {!disabledPagination && (
          <button
            className={cx(
              "top-0 left-0 p-1 mx-0.5 bg-gray-50/40 text-gray-800 rounded-lg flex flex-row items-center justify-center w-6  hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
              isScroll ? "visible" : "invisible"
            )}
            onClick={() => emblaApi && emblaApi.scrollPrev()}
          >
            <FaAngleLeft />
          </button>
        )}

        <div className="flex flex-grow" ref={wrapper}>
          {ready ? (
            <div
              className={cx("overflow-hidden flex-grow")}
              style={{
                width: widthWrapper,
              }}
              ref={emblaRef}
            >
              <div className="flex flex-shrink-0" ref={item}>
                {children}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        {!disabledPagination && (
          <button
            className={cx(
              "top-0 left-0 p-1 mx-0.5 bg-gray-50/40 text-gray-800 rounded-lg flex flex-row items-center justify-center w-6  hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
              isScroll ? "visible" : "invisible"
            )}
            onClick={() => emblaApi && emblaApi.scrollNext()}
          >
            <FaAngleRight />
          </button>
        )}
      </div>
    </div>
  );
};
export default TabSlider;
