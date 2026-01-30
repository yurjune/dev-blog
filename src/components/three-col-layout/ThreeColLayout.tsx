import { FC, PropsWithChildren } from "react";

interface ThreeColLayoutComponent extends FC<PropsWithChildren> {
  Left: FC<PropsWithChildren>;
  Center: FC<PropsWithChildren>;
  Right: FC<PropsWithChildren>;
}

export const ThreeColLayout: ThreeColLayoutComponent = ({ children }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr]">
      {children}
    </div>
  );
};

const Left: FC<PropsWithChildren> = ({ children }) => {
  return <div className="hidden xl:block w-44 shrink-0">{children}</div>;
};
Left.displayName = "ThreeColLayoutLeft";

const Center: FC<PropsWithChildren> = ({ children }) => {
  return <div className="max-w-3xl px-4 py-4">{children}</div>;
};
Center.displayName = "ThreeColLayoutCenter";

const Right: FC<PropsWithChildren> = ({ children }) => {
  return <div className="hidden xl:block w-44 shrink-0">{children}</div>;
};
Right.displayName = "ThreeColLayoutRight";

ThreeColLayout.Left = Left;
ThreeColLayout.Center = Center;
ThreeColLayout.Right = Right;
