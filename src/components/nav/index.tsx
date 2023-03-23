/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import colors from "../../styles/colors";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

const styles = css`
  width: 100vw;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 1px solid ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  background:black;
  z-index:2;
  h3 {
    color: ${colors.primary};
    margin-bottom: 0;
    font-weight:bold;
    letter-spacing: 4px;
  }
  a{
    position:absolute;
    left: 10px;
    top:50%;
    transform:translate(0,-50%)
  }
`;

const Nav = () => {
    let location = useLocation()
  return (
    <div css={styles}>
    {location.pathname!=='/' && <Link className="text-primary text-decoration-none" to='/'>Back</Link>}
      <h3>Phone Book</h3>
    </div>
  );
};

export default Nav;
