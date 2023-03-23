/** @jsxImportSource @emotion/react */

import React from "react";
import { css } from "@emotion/react";
import colors from "../../styles/colors";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  required?: boolean;
  extra?: React.ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputStyle = css`
  padding: 10px;
  border: 1px solid ${colors.dark_grey};
  border-radius: 5px;\
  background:none;
  outline: none;
  font-size: 1rem;
  color: ${colors.light_grey};
  flex-grow: 1;
  &::placeholder {
    color: ${colors.dark_grey};
  }
  &:focus {
   border:1px solid ${colors.primary}
  }
`;
const labelStyle = css`
  margin-bottom: 5px;
`;
const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  required,
  onChange,
  extra,
}) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    `}
  >
    <label css={labelStyle} htmlFor={name}>
      {label}
    </label>
    <div className="d-flex">
      <input
        css={inputStyle}
        id={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        type={type}
        required={required}
      />
      {extra || null}
    </div>
  </div>
);

export default Input;
