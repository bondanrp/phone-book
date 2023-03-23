/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { getName, hexToHSL } from "../../helper/functions";
import seedColor from "seed-color";

interface props {
  children: string;
  small?:boolean
}

const ContactIcon = ({ children,small }: props) => {
  let value = getName(children);
  let color = seedColor(children).toHex();
  const hslColor = hexToHSL(color);
  const styles = css`
    width: ${small? "20px":"150px"};
    height: ${small? "20px":"150px"};
    display: flex;
    position:relative;
    border-radius: 50%;
    background: ${color};
    color: ${hslColor.l < 0.5 ? "white" : "black"};
    p{
        font-size: ${small? "8px":"32px"};
        font-weight:bold;
        margin-bottom:0;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%)
    }
  `;

  return <div css={styles}><p>{value}</p></div>;
};

export default ContactIcon;
