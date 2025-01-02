import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  Placement,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import * as React from "react";
import "./Popover.css";
import { css } from "@emotion/css";

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  offset?: number;
  onOpenChange?: (open: boolean) => void;
  autoFocus?: boolean;
  backdrop?: boolean | "self";
  root?: HTMLElement;
}

export function usePopover({
  initialOpen = false,
  placement = "bottom",
  modal = false,
  open: controlledOpen,
  offset: popoverOffset = 5,
  onOpenChange: setControlledOpen,
  autoFocus = false,
  backdrop = true,
  root,
}: PopoverOptions = {}) {
  const arrowRef = React.useRef<HTMLDivElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  // Determine whether the popover is open
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  // Floating UI setup
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(popoverOffset),
      flip({
        fallbackAxisSideDirection: "end",
        padding: 8,
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;

  // Add interactions (click, dismiss, role)
  const click = useClick(context, {
    enabled: controlledOpen == null, // Only enable if not controlled
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Combine all interactions
  const interactions = useInteractions([click, dismiss, role]);

  // Return memoized popover properties
  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      backdrop,
      autoFocus,
      root,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      modal,
      labelId,
      descriptionId,
      backdrop,
      autoFocus,
      root,
    ]
  );
}


function mapPlacementSideToCSSProperty(placement: Placement) {
  const staticPosition = placement.split("-")[0];

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[staticPosition];

  return staticSide;
}
function PopoverArrow() {
  const context = usePopoverContext();
  const { x: arrowX, y: arrowY } = context.middlewareData.arrow || {
    x: 0,
    y: 0,
  };
  const staticSide = mapPlacementSideToCSSProperty(context.placement) as string;

  return (
    <div
      ref={context.arrowRef}
      style={{
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        [staticSide]: "-4px",
        transform: "rotate(45deg)",
        cursor: "pointer",
      }}
      className={cx(
        "arrow",
        css`
          pointer-events: none;
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
        `
      )}
    />
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
};

export function Popover({
  children,
  content,
  modal = false,
  className,
  classNameTrigger,
  arrow,
  ...restOptions
}: {
  root?: HTMLElement;
  className?: string;
  classNameTrigger?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  arrow?: boolean;
} & PopoverOptions) {
  const popover = usePopover({ modal, ...restOptions });

  let _content = content;
  if (!content) _content = <div className={"w-[300px] h-[150px]"}></div>;
  return (
    <PopoverContext.Provider value={popover}>
      <PopoverTrigger
        asChild
        className={cx("h-full cursor-pointer", classNameTrigger)}
        onClick={
          typeof restOptions.open !== "undefined"
            ? () => {
                popover.setOpen(!popover.open);
              }
            : undefined
        }
      >
        {[children]}
      </PopoverTrigger>
      <PopoverContent
        className={cx(
          className,
          css`
            background: white;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
            user-select: none;
          `,
        )}
        
      >
        {_content}
        {(typeof arrow === "undefined" || arrow) && <PopoverArrow />}
      </PopoverContent>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();

  // Gabungkan refs dari popover context dan ref prop
  const ref = useMergeRefs([context.refs.setReference, propRef]);

  // `asChild` memungkinkan elemen anak digunakan sebagai anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...context.getReferenceProps({
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      }),
    } as any);
  }

  return (
    <div
      ref={ref}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props as any)}
    >
      {children}
    </div>
  );
});


export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  const _content = (
    <div
      ref={ref}
      style={{
        ...context.floatingStyles,
        ...props.style,
      }}
      aria-labelledby={context.labelId}
      aria-describedby={context.descriptionId}
      {...context.getFloatingProps(props as any)}
    >
      {props.children}
    </div>
  );

  const content = context.autoFocus ? (
    <FloatingFocusManager context={floatingContext} modal={context.modal}>
      {_content}
    </FloatingFocusManager>
  ) : (
    _content
  );

  return (
    <FloatingPortal root={context.root}>
      {context.backdrop ? (
        <FloatingOverlay className={"z-50"} lockScroll>
          {content}
        </FloatingOverlay>
      ) : (
        content
      )}
    </FloatingPortal>
  );
});

export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading({ children, ...props }, ref) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  );
});

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function PopoverDescription({ children, ...props }, ref) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  );
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});
