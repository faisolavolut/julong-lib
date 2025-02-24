import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 7" {...props}>
    <path
      fill="currentColor"
      d="M12.5 6a.47.47 0 0 1-.35-.15L8 1.71 3.85 5.85c-.2.2-.51.2-.71 0s-.2-.51 0-.71L7.65.65c.2-.2.51-.2.71 0l4.5 4.5c.2.2.2.51 0 .71-.1.1-.23.15-.35.15Z"
    />
  </svg>
);
export { SvgComponent as Up };
