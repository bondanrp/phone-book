/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import colors from "../../styles/colors";

interface props {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  small?: boolean
}

const Card = ({ onClick, disabled, children, className, type,small }: props) => {
  const styles = css`
    display: block;
    border: 1px solid ${colors.card};
    background: ${colors.card};
    border-radius: 4px;
    width: 100%;
    max-width: ${small? '400px' :''};
    padding:10px;
    transition: all 0.3s;
   ${
     onClick &&
     `&:hover{
      border: 1px solid ${colors.primary} !important;`
   }
  }`;
  if (onClick) {
    return (
      <button
        type={type || "button"}
        className={className}
        css={styles}
        onClick={onClick}
      >
        {children}
      </button>
    );
  } else {
    return (
      <div className={className} css={styles} onClick={onClick}>
        {children}
      </div>
    );
  }
};

export default Card;
