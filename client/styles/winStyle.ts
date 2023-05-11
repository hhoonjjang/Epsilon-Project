import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
    bg: 'var(--white)',
    fg: 'var(--black)',
    ac: 'var(--dark)',
    light: 'var(--blue)',
};

export const darkTheme = {
    bg: 'var(--backgroundgrey)',
    fg: 'var(--light)',
    ac: 'var(--grey)',
    light: '#EEE',
};

const WinStyle = createGlobalStyle`
${reset}
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html, body{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    /* font-family: Righteous, Poor Story !important; */
    font-family: Noto Sans KR !important;
    color: ${({ theme }) => theme.fg};
    background-color: ${({ theme }) => theme.bg};
    border-color: ${({ theme }) => theme.ac};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* #region root value */

:root {
  --orange: #ff8f00;
  --hotpink: #E53935;
  --purple: #8247E5;
  --gold: #ffd740;
  --blue: #2979ff;
  
  --black: #000;
  --backgroundgrey: #1E1E1E;
  --darkgrey: #212121;
  --dark: #333;
  --grey: #414141;
  --middlegrey: #616161;
  --lightgrey: #9e9e9e;
  --white: #fff;
  --light: ${({ theme }) => theme.light};

  --orangelight: rgba(255, 215, 64, 0.6);

  --radius: 5px;

  --border-gradient: conic-gradient( 
    var(--gold),
    var(--gold),
    var(--light),
    var(--gold),
    var(--gold) 
  );

  --fg: ${({ theme }) => theme.fg};
  --bg: ${({ theme }) => theme.bg};
  --ac: ${({ theme }) => theme.ac};
}

/* #endregion */

/* #region Font */

/* ======== Move to _document Head link import => fontImport.css */

/* #endregion */

/* #region colors */

.fg-hotpink {
  --fg: var(--hotpink);
  color: var(--hotpink) !important;
}
.bg-hotpink {
  --bg: var(--hotpink);
  background-color: var(--hotpink);
}
.ac-hotpink {
  --ac: var(--hotpink);
}
.fg-orange {
  --fg: var(--orange);
  color: var(--orange) !important;
}
.bg-orange {
  --bg: var(--orange);
  background-color: var(--orange);
}
.ac-orange {
  --ac: var(--orange);
}
.fg-purple {
  --fg: var(--purple);
  color: var(--purple) !important;
}
.bg-purple {
  --bg: var(--purple);
  background-color: var(--purple);
}
.ac-purple {
  --ac: var(--purple);
}
.fg-gold {
  --fg: var(--gold);
  color: var(--gold) !important;
}
.bg-gold {
  --bg: var(--gold);
  background-color: var(--gold);
}
.ac-gold {
  --ac: var(--gold);
}
.fg-blue {
  --fg: var(--blue);
  color: var(--blue) !important;
}
.bg-blue {
  --bg: var(--blue);
  background-color: var(--blue);
}
.ac-blue {
  --ac: var(--blue);
}
.fg-black {
  --fg: var(--black);
  color: var(--black) !important;
}
.bg-black {
  --bg: var(--black);
  background-color: var(--black);
}
.ac-black {
  --ac: var(--black);
}
.fg-white {
  --fg: var(--white);
  color: var(--white) !important;
}
.bg-white {
  --bg: var(--white);
  background-color: var(--white);
}
.ac-white {
  --ac: var(--white);
}
.fg-dark {
  --fg: var(--dark);
  color: var(--dark) !important;
}
.bg-dark {
  --bg: var(--dark);
  background-color: var(--dark);
}
.ac-dark {
  --ac: var(--dark);
}
.fg-grey {
  --fg: var(--grey);
  color: var(--grey) !important;
}
.bg-grey {
  --bg: var(--grey);
  background-color: var(--grey);
}
.ac-grey {
  --ac: var(--grey);
}
.fg-light {
  --fg: var(--light);
  color: var(--light) !important;
}
.bg-light {
  --bg: var(--light);
  background-color: var(--light);
}
.ac-light {
  --ac: var(--light);
}
.fg-darkgrey {
  --fg: var(--darkgrey);
  color: var(--darkgrey) !important;
}
.bg-darkgrey {
  --bg: var(--darkgrey);
  background-color: var(--darkgrey);
}
.ac-darkgrey {
  --ac: var(--darkgrey);
}
.fg-middlegrey {
  --fg: var(--middlegrey);
  color: var(--middlegrey) !important;
}
.bg-middlegrey {
  --bg: var(--middlegrey);
  background-color: var(--middlegrey);
}
.ac-middlegrey {
  --ac: var(--middlegrey);
}
.fg-lightgrey {
  --fg: var(--lightgrey);
  color: var(--lightgrey) !important;
}
.bg-lightgrey {
  --bg: var(--lightgrey);
  background-color: var(--lightgrey);
}
.ac-lightgrey {
  --ac: var(--lightgrey);
}

/* #endregion */

/* #region button */

.winStyle-button {
  --button-font-size: 1rem;
  --button-padding-v : 0.6rem;
  --button-padding-h : 1.5rem;
  --button-radius: 10px;
  --border-width : 1px;

  content: "";
  cursor:pointer;
  border: 0px solid transparent;
  display: inline-block;
  text-align: center;
  position:relative;
  font-size: var(--button-font-size);
  font-weight: 500;
  padding: var(--button-padding-v) var(--button-padding-h);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--button-radius);
  overflow: hidden;

color: var(--lightgrey);
&::before {
  content: "";
  position:absolute;
  animation: 4s rotate linear infinite;
  width: 200%;
  height: 500%;
  background: var(--dark);
}
&::after {
  content: attr(data-title);
  display:flex;
  align-items: center;
  justify-content: center;
  position:absolute;
  inset: 0;
  padding: var(--border-width);
  border-radius: var(--button-radius);
  background: var(--bg);
  background-clip: content-box;
}
&:hover::after{
  /* animation: .15s ease-out btnHover forwards; */
  /* background: transparent; */
  /* background-clip: none;     */
}
&:hover::before{
  background: var(--border-gradient);
}
&:hover{
  color: var(--gold);
}
  /* &.off{
    border: 1px solid var(--dark);
    color: var(--lightgrey) !important;
  } */
}

/* #endregion */

/* #region box */

.winStyle {
  border-radius: var(--radius);
  border: 1px solid var(--ac);
  padding: 1rem 1.6rem;
  font-size: 0.7rem;
  width: fit-content;
}

.winStyle-LR, .winStyle-TB{
  width : fit-content;
  height: fit-content;
  border-radius: var(--radius);
  box-shadow: 0px 0px 4px .5px var(--orangelight);
  padding: 0.6rem 1.5rem;
  color: var(--white);
  & > div{
    background-color: transparent;
  }
}
.winStyle-LR {
  background: linear-gradient(90deg, var(--bg) 0%, var(--ac) 100%);
}
.winStyle-TB {
  background: linear-gradient(180deg, var(--bg) 0%, var(--ac) 100%);
}
.swapStyle-LR {

  color: var(--white);
  background: linear-gradient(90deg, var(--bg) 0%, var(--ac) 100%);
}


/* #endregion */

/* #region font-gradient */

.winStyle-fontGradient {
  display: inline-block;
  /* background: linear-gradient(130deg, var(--fg) 0%, var(--fg) 40%, var(--light) 50%, var(--fg) 57%, var(--orange) 100%); */
  background: linear-gradient(-30deg, var(--fg) 0%, var(--fg) 40%, var(--light) 50%, var(--fg) 57%, var(--ac) 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* #endregion */

/* #region infoHover */

.winStyle-info {
  position:relative;
  &:hover{
    & img {
      filter: invert(86%) sepia(63%) saturate(1629%) hue-rotate(321deg) brightness(105%) contrast(103%); 
    }
    &::after{
      
      opacity: 1;
      transition: all 0.2s ease-in-out;
    }
  }
  &::after {
    pointer-events: none;
    content: attr(data-text);
    position:absolute;
    width : 500px;
    inset: 0;
    left: 2rem;
    padding: var(--border-width);
    border-radius: var(--button-radius);
    background-color:transparent;
    opacity:0;
  }
}

/* #endregion */

/* #region scroll */
.winStyle-scroll {
  max-height: 500px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 10px;
        border: 2px solid white;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
    &::-webkit-scrollbar-track {
        background-color: #ddd;
    }
}


/* #endregion */

/* #region animation */

@keyframes rotate {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes btnHover {
  from {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 5%, var(--light) 15%, var(--fg) 25%, var(--fg) 100%);
  }
  10% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 8%, var(--light) 18%, var(--fg) 25%, var(--fg) 100%);
  }
  20% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 15%, var(--light) 25%, var(--fg) 35%, var(--fg) 100%);
  }
  50% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 18%, var(--light) 30%, var(--fg) 40%, var(--fg) 100%);
  }
  70% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 25%, var(--light) 35%, var(--fg) 45%, var(--fg) 100%);
  }
  80% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 35%, var(--light) 45%, var(--fg) 55%, var(--fg) 100%);
  }
  90% {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 45%, var(--light) 55%, var(--fg) 65%, var(--fg) 100%);
  }
  to {
    background: linear-gradient(120deg, var(--fg) 0%, var(--fg) 60%, var(--light) 70%, var(--fg) 80%, var(--fg) 100%);
  }
}

@keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateX(-50%) translateY(0);
        }
        40% {
            transform: translateX(-50%) translateY(-30px);
        }
        60% {
            transform: translateX(-50%) translateY(-15px);
        }
    }

/* #endregion */

`;

export default WinStyle;
