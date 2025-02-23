import type { FC } from "react";

type HeaderProps = {
  headerLeftIcon?: React.ReactNode;
  headerRightIcon?: React.ReactNode;
  title: string;
  onHeaderLeftClick?: () => void;
  onHeaderRightClick?: () => void;
};

export const Header: FC<HeaderProps> = ({
  headerLeftIcon,
  headerRightIcon,
  title,
  onHeaderLeftClick,
  onHeaderRightClick,
}) => {
  return (
    <header className="h[50px] sticky top-0 z-50 flex w-full flex-row items-center justify-between border-b border-[rgba(255,255,255,0.25)] bg-gray-950">
      <HeaderButtonContainer onClick={onHeaderLeftClick}>
        {headerLeftIcon}
      </HeaderButtonContainer>

      <h1 className="text-base font-semibold">{title}</h1>

      <HeaderButtonContainer onClick={onHeaderRightClick}>
        {headerRightIcon}
      </HeaderButtonContainer>
    </header>
  );
};

const HeaderButtonContainer: FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!children}
      className="flex aspect-square h-[50px] w-[50px] flex-row items-center justify-center"
    >
      {children}
    </button>
  );
};
