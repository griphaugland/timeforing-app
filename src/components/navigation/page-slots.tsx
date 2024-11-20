import React, { Children, ReactNode } from "react";
import Transition from "../navigation/transition";

type Props = {
  children?: React.ReactNode;
};

type Slots = {
  top: ReactNode | null;
  left: ReactNode | null;
  right: ReactNode | null;
  bottom: ReactNode | null;
};

function Top({ children }: Props) {
  return <div className="[grid-area:top]">{children}</div>;
}

function Left({ children }: Props) {
  return <div className="[grid-area:left] w-full">{children}</div>;
}

function Right({ children }: Props) {
  return (
    <div className="[grid-area:right] w-full h-full md:w-[300px]">
      {children}
    </div>
  );
}

function Bottom({ children }: Props) {
  return <div className="[grid-area:bottom]">{children}</div>;
}

export function PageSlots({ children }: Props) {
  const slots: Slots = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  };

  Children.forEach(children, (child) => {
    switch ((child as React.ReactElement<Props>).type) {
      case Top: {
        slots.top = child;
        break;
      }
      case Left: {
        slots.left = child;
        break;
      }
      case Right: {
        slots.right = child;
        break;
      }
      case Bottom: {
        slots.bottom = child;
        break;
      }
    }
  });

  return (
    <Transition>
      <div className="grid max-w-content mx-auto pt-4 px-4 md:px-6 gap-4 mt-[10vh] md:mt-[20vh] pb-6 md:pb-[10vh]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-4">
          {slots.top && (
            <div className="col-span-1 md:col-span-2">{slots.top}</div>
          )}
          <div className="order-2 md:order-1">{slots.left}</div>
          <div className="order-1 h-full md:order-2">{slots.right}</div>
          {slots.bottom && (
            <div className="col-span-1 md:col-span-2 order-3">
              {slots.bottom}
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
}

PageSlots.Top = Top;
PageSlots.Left = Left;
PageSlots.Right = Right;
PageSlots.Bottom = Bottom;

export default PageSlots;
