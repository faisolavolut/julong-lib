import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M5 12V4m14 16v-3M5 20v-4m14-3V4m-7 3V4m0 16v-9" />
      <circle cx={5} cy={14} r={2} />
      <circle cx={12} cy={9} r={2} />
      <circle cx={19} cy={15} r={2} />
    </g>
  </svg>
);
export { SvgComponent as FilterOutline };
