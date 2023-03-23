/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import colors from "../../styles/colors";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  color?: keyof typeof colors;
  className?: string;
  outlined?: boolean;
}

const Button = ({
  onClick,
  disabled,
  children,
  type,
  color = "primary",
  className,
  outlined,
}: ButtonProps) => {
  const styles = css`
    display: inline-block;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;
    color: #fff;
    ${outlined
      ? `background:none;
      border: 1px solid ${colors[color]};
      color: ${colors[color]};`
      : `background-color: ${colors[color]};
      border: none;`}
    cursor: pointer;
    &:hover {
      filter: brightness(110%);
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  return (
    <button
      type={type || "button"}
      css={styles}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
