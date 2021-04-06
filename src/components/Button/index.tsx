import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import style from "./style.module.scss";
import { Link, LinkProps } from "react-router-dom";

export interface ButtonProps {
  theme?: "orange" | "yellow" | "blue" | "green";
  size?: "small" | "medium";
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, theme = "orange", size = "medium", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        style.button,
        style[`button--${theme}`],
        style[`button--size-${size}`],
        className
      )}
      {...props}
    />
  );
});

export const ButtonLink: React.FC<ButtonProps & LinkProps> = ({
  className,
  theme = "orange",
  size = "medium",
  ...props
}) => {
  return (
    <Link
      className={classNames(
        style.button,
        style[`button--${theme}`],
        style[`button--size-${size}`],
        className
      )}
      {...props}
    />
  );
};
