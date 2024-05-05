import { createGlobalStyle, css } from 'styled-components'

export const GlobalStyle = createGlobalStyle<{ $light?: boolean }>`
  :root {
    --main-color: #559399;
    --neutral: #3D405B;
    --light-blue: #b3d2d5;
    --orange: #f7c370;
    --shadow: .3rem .3rem .6rem var(--greyLight-2), -.2rem -.2rem .5rem var(--white);
    --inner-shadow: inset .2rem .2rem .5rem var(--greyLight-2), inset -.2rem -.2rem .5rem var(--white);
  }
  body {
    padding: 0 !important;
    position: relative;
    background-color: rgb(6, 61, 66);
  }
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
    &.light {
      color: saturate(--light-blue, 50%);

      &:hover {
        color: lighten(saturate(var(--light-blue), 50%), 15%);
      }
    }
  }
  h1 {
    margin: 0;
    color: darken(var(--main-color), 20%);
    text-shadow: 1px 1px 0 lighten(var(--main-color), 5%);
  }
  p {
    margin-top: 0; 
    margin-bottom: 0;
  }
  ul {
    li {
      ul {
        list-style: disc;
      }
    }
  }
  .bg-main {
    background-color: var(--main-color);
  }
  fieldset {
    border: 1px solid rgba(54, 54, 54, .2);
    border-radius: 0.4rem;
    padding: 0 1rem 1rem 1rem;
    legend {
        margin-top: -0.75rem;
        margin-bottom: 1.5rem;
        background-color: white;
        display: inline-block;
        width: auto;
        padding: 0 .5rem;
        font-weight: bold;
        font-size: 1rem;
        color: #999;
    }
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-between {
    justify-content: between;
  }
  .justify-center {
    justify-content: center;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-row {
    flex-direction: row;
  }
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .top-0 {
    top: 0;
  }
  .bottom-0 {
    bottom: 0;
  }
  .right-0 {
    right: 0;
  }
  .left-0 {
    left: 0;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-lg {
    font-size: 1.5rem;
  }
  .w-full {
    width: 100%;
  }
  .block {
    display: block;
  }
  .none {
    display: none;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .rounded-full {
    border-radius: 50%;
  }
  .rounded-lg {
    border-radius: 1.5rem;
  }
  .bg-white {
    background-color: white;
  }
  .text-sm {
    font-size: .8rem;
  }
  .btn-primary {
    --bs-btn-color: #2e4934 !important;
    --bs-btn-bg: #81F499 !important;
    --bs-btn-border-color: #81F499 !important;
    --bs-btn-hover-color: #528b5f;
    --bs-btn-hover-bg: #92ffaa;
    --bs-btn-hover-border-color: #92ffaa !important;
    --bs-btn-focus-shadow-rgb: 49,132,253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #92ffaa;
    --bs-btn-active-border-color: #7ee494;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: #fff;
    --bs-btn-disabled-bg: #81F499;
    --bs-btn-disabled-border-color: #81F499;
  }
  .btn {
    --bs-btn-padding-x: 0.75rem;
    --bs-btn-padding-y: 0.375rem;
    --bs-btn-font-family: ;
    --bs-btn-font-size: 1rem;
    --bs-btn-font-weight: 400;
    --bs-btn-line-height: 1.5;
    --bs-btn-color: var(--bs-body-color);
    --bs-btn-bg: transparent;
    --bs-btn-border-width: var(--bs-border-width);
    --bs-btn-border-color: transparent;
    --bs-btn-border-radius: var(--bs-border-radius);
    --bs-btn-hover-border-color: transparent;
    --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),0 1px 1px rgba(0, 0, 0, 0.075);
    --bs-btn-disabled-opacity: 0.65;
    --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5);
    display: inline-block;
    padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
    font-family: var(--bs-btn-font-family);
    font-size: var(--bs-btn-font-size);
    font-weight: var(--bs-btn-font-weight);
    line-height: var(--bs-btn-line-height);
    color: var(--bs-btn-color);
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
    border-radius: var(--bs-btn-border-radius);
    background-color: var(--bs-btn-bg);
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        color: var(--bs-btn-hover-color);
        background-color: var(--bs-btn-hover-bg);
        border-color: var(--bs-btn-hover-border-color);
    }
  }
  .slideIn {
      animation: slideIn .5s ease-in 1 both;
      &.fadeIn {
          animation: slideIn .5s ease-in 1 both, fadeIn .5s ease-in 1 both;
      }
  }
  .slideOut {
      animation: slideOut .5s ease-in 1 both;
      &.fadeOut {
          animation: slideOut .5s ease-in 1 both, fadeOut .5s ease-in 1 both;
      }
  }
  .fadeIn {
      animation: fadeIn .5s ease-in 1 both;
  }
  .fadeOut {
      animation: fadeOut .5s ease-in 1 both;
  }
  .button {
    height: 0;
    border: none;
    padding: 1.5rem;
    border-radius: .6rem;
    box-shadow: var(--shadow);
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: .3s ease;
    &.btn_primary {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
      background: var(--neutral);
      // box-shadow:inset .2rem .2rem .5rem lighten(var(--neutral), 5%), 
      //         inset -.2rem -.2rem .5rem darken(var(--neutral), 5%),
      //         var(--shadow);
      color: white;

      &:hover { color: white; }
      &:active {
          // box-shadow:inset .2rem .2rem 1rem lighten(var(--neutral), 5%), 
          //     inset -.2rem -.2rem 1rem darken(var(--neutral), 5%);
      }
    }
    &.btn_secondary {
      grid-column: 1 / 2;
      grid-row: 5 / 6;
      color: var(--greyDark);
      &:hover { color: var(--primary); }
      &:active {
          box-shadow: var(--inner-shadow);
      }
    }
  }
  .dropzone {
    border-radius: .425rem;
    border: 2px dashed rgba(34, 34, 34, .2);

    &.drag-active {
        border: 2px dashed rgb(27, 130, 190, 1);
    }
}
  #logo {
    .logo {
      img {
        padding: .75rem;
        background-color: #1a2b20;
        border-radius: 0 0 .5rem .5rem;
        position: relative;
        box-shadow: 0 0 30px rgb(146,224,225,.75);
        margin-top: -3px;
        &::before, &::after {
          content: '';
          position: absolute;
          z-index: 1;
          background-color: transparent;
          top: 0;
          height: 10px;
          width: 15px;
        }
        &::before {
          left: -15px;
          border-top-right-radius: 10px;
          box-shadow: 10px 0 0 0 #1f2220;
        }
        &::after {
          right: -15px;
          border-top-left-radius: 10px;
          box-shadow: -10px 0 0 0 #1f2220;
        }
        img {
          width: 1.5rem;
        }
      }
    }
  }
  @keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
  }
  @keyframes fadeOut {
      0% {
          opacity: 1;
      }
      100% {
          opacity: 0;
      }
  }
  @keyframes slideIn {
      0% {
          left: -100%;
      }
      100% {
          left: 0;
      }
  }
  @keyframes slideOut {
      0% {
          left: 0;
      }
      100% {
          left: 100%;
      }
  }
  @keyframes move-forever {
      0% {
      transform: translate3d(-90px,0,0);
      }
      100% { 
        transform: translate3d(85px,0,0);
      }
  }
  @keyframes spin {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
  }
  @keyframes fadeInRight {
      0% {
          transform: translateX(-25%);
          opacity: 0;
      }
      100% {
          transform: translateX(0%);
          opacity: 1;
      }
      
  }
  @keyframes drift {
      from { transform: rotate(0deg); }
      from { transform: rotate(360deg); }
  }
`;