import React, {
useState,
useMemo,
useEffect,
useRef,
useCallback } from
"https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18";
import { useControls } from "https://esm.sh/leva@0.9.35";
import { createNoise3D } from "https://esm.sh/simplex-noise@4.0.1";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const smoothstep = (edge0, edge1, x) => {
  x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};
const rand = (min, max) => min + Math.random(max - min);

const opt = {
  size: 2,
  cols: 300,
  rows: 300,
  speed: 2,
  rot: 2 };


const Canvas = () => {
  const $canvas = useRef();
  const $ctx = useRef();
  const $bg = useRef();
  const mouse = useRef({ x: window.innerWidth * .5, y: window.innerHeight * .5, prevX: 0, prevY: 0, speed: 0 });
  const win = useRef({ w: 0, h: 0 });

  const grid = useRef([]);
  const line = useRef([]);
  const rafID = useRef();
  const time = useRef(0);
  const noise = createNoise3D();

  /*--------------------
  Click
  --------------------*/
  const handleClick = e => {
    mouse.current.x = e.touches ? e.touches[0].clientX : e.clientX || win.current.w * .5;
    mouse.current.y = e.touches ? e.touches[0].clientY : e.clientY || win.current.h * .5;
    init();
  };

  /*--------------------
  Circles
  --------------------*/
  const circles = (width, num, minRadius, maxRadius, speed) => {
    const $c = $ctx.current;
    $c.strokeStyle = '#ffffff';
    $c.lineWidth = .1;
    $c.save();
    $c.translate(win.current.w * .5, win.current.h * .5);

    for (let i = 0; i < num; i++) {
      const theta = i / num * Math.PI * 2;
      const x = Math.sin(theta) * width;
      const y = Math.cos(theta) * width;
      const n1 = noise(x * .01, y * .01, time.current * speed) * 10;
      const n2 = .5 + .5 * noise(x * .01, y * .01, time.current * speed);

      const r = minRadius + n2 * (maxRadius - minRadius);

      $c.beginPath();
      $c.arc(x + n1, y + n1, r, 0, Math.PI * 2);
      $c.stroke();
    }
    $c.restore();

  };


  /*--------------------
  Draw
  --------------------*/
  const draw = () => {
    const $c = $ctx.current;
    if (!$c) return;
    $c.clearRect(0, 0, win.current.w, win.current.h);
    circles(150, 300, 30, 70, 1);
    circles(100, 200, 20, 60, .5);
    circles(50, 100, 10, 50, .2);

    time.current += .01;
    rafID.current = requestAnimationFrame(draw);
  };

  /*--------------------
  Init
  --------------------*/
  const init = () => {
    if (!$canvas.current) return;
    const dpr = window.devicePixelRatio || 1;
    win.current.w = window.innerWidth;
    win.current.h = window.innerHeight;
    $canvas.current.width = win.current.w * dpr;
    $canvas.current.height = win.current.h * dpr;

    $ctx.current = $canvas.current.getContext('2d');
    $ctx.current.strokeStyle = 'rgba(255, 255, 255, .15)';
    $ctx.current.scale(dpr, dpr);

    if (rafID.current) cancelAnimationFrame(rafID.current);
    draw();
  };

  /*--------------------
  Start
  --------------------*/
  useEffect(() => {
    $ctx.current = $canvas.current.getContext('2d');
    window.addEventListener('resize', init);
    window.addEventListener('click', handleClick);
    init();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafID.current);
    };
  }, []);

  return /*#__PURE__*/(
    React.createElement(React.Fragment, null, /*#__PURE__*/
    React.createElement("canvas", { className: "canvas", ref: $canvas }), /*#__PURE__*/
    React.createElement("div", { className: "bg", ref: $bg })));


};

const App = () => {
  return /*#__PURE__*/(
    React.createElement(Canvas, null));

};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));