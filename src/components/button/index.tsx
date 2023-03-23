/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import colors from "../../styles/colors";
import { hexToHSL } from "../../helper/functions";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  color?: keyof typeof colors;
  className?: string;
  outlined?: boolean;
  small?:boolean
}

const Button = ({
  onClick,
  disabled,
  children,
  type,
  color = "primary",
  className,
  outlined,
  small
}: ButtonProps) => {
  let dark = hexToHSL(colors[color]).l < 0.5;
  const styles = css`
    display: inline-block;
    padding: ${small? '0px 4px':"6px 12px"};
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s;
    color: ${dark ? "#e8e8e8" : "#121212"};
    ${
      outlined
        ? `background:none;
      border: 1px solid ${colors[color]};
      color: ${colors[color]};
      `
        : `background-color: ${colors[color]};
      border: none;`
    }
    cursor: pointer;
    &:hover {
      filter: brightness(110%);
      ${
        outlined
          ? `background-color: ${colors[color]};
      border: 1px solid ${colors[color]};
      color:${dark ? "#e8e8e8" : "#121212"};`
          : `filter: brightness(110%);`
      }}
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
