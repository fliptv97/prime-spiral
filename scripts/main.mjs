import { getNaturalNumbers, isPrime } from "/scripts/math.mjs";

// Constants
const TILE_SIZE = 50;

const DIRECTION_UP = 0;
const DIRECTION_RIGHT = 1;
const DIRECTION_BOTTOM = 2;
const DIRECTION_LEFT = 3;

const NEXT_DIRECTION_FOR = {
  [DIRECTION_UP]: DIRECTION_LEFT,
  [DIRECTION_RIGHT]: DIRECTION_UP,
  [DIRECTION_BOTTOM]: DIRECTION_RIGHT,
  [DIRECTION_LEFT]: DIRECTION_BOTTOM,
};

// Main code
(function init() {
  let timerId = null;

  const canvasEl = document.getElementById("canvas");

  // Settings
  const sizeInputEl = document.getElementById("size-input");
  const startNumberEl = document.getElementById("start-number-input");
  const highlightStartCheckboxEl = document.getElementById("highlight-start");
  const animateCheckboxEl = document.getElementById("animate");
  const hideNumbersCheckboxEl = document.getElementById("hide-numbers");

  const getOptions = () => ({
    shouldHighlightStart: highlightStartCheckboxEl.checked,
    shouldAnimate: animateCheckboxEl.checked,
    shouldHideNumbers: hideNumbersCheckboxEl.checked,
  });

  // Initial render
  // TODO: Change name
  let spiralSize = Number.parseInt(sizeInputEl.value);

  let nums = getNaturalNumbers(
    Math.pow(spiralSize, 2),
    Number.parseInt(startNumberEl.value)
  );

  setCanvasSize(canvasEl, TILE_SIZE * spiralSize);
  renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());

  // Listeners
  sizeInputEl.addEventListener("change", (e) => {
    spiralSize = Number.parseInt(e.target.value);

    nums = getNaturalNumbers(
      Math.pow(spiralSize, 2),
      Number.parseInt(startNumberEl.value)
    );

    setCanvasSize(canvasEl, TILE_SIZE * spiralSize);
    renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());
  });

  startNumberEl.addEventListener("input", (e) => {
    nums = getNaturalNumbers(
      Math.pow(spiralSize, 2),
      Number.parseInt(e.target.value)
    );

    renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());
  });

  highlightStartCheckboxEl.addEventListener("change", () => {
    renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());
  });

  animateCheckboxEl.addEventListener("change", () => {
    const options = getOptions();

    if (options.shouldAnimate) {
      let start = Number.parseInt(startNumberEl.value);

      timerId = setInterval(() => {
        nums = getNaturalNumbers(
          Math.pow(spiralSize, 2),
          Number.parseInt(start)
        );

        renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());

        start++;
      }, 150);
    } else {
      clearInterval(timerId);

      renderPrimeSpiral(canvasEl, spiralSize, nums, options);
    }
  });

  hideNumbersCheckboxEl.addEventListener("change", () => {
    renderPrimeSpiral(canvasEl, spiralSize, nums, getOptions());
  });
})();

// Helpers
function setCanvasSize(canvas, size) {
  canvas.setAttribute("width", size);
  canvas.setAttribute("height", size);
}

function clearCanvas(canvas) {
  const size = Number.parseInt(canvas.getAttribute("width"));
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#282a36";
  ctx.fillRect(0, 0, size, size);
}

function renderPrimeSpiral(canvas, spiralSize, nums, options = {}) {
  clearCanvas(canvas);

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.font = "1.2rem monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const halfTileSize = TILE_SIZE / 2;

  let currentDirection = DIRECTION_RIGHT;

  let x = Math.floor(spiralSize / 2);
  let y = Math.floor(spiralSize / 2);

  let linksBetweenNums = 1;
  let links = 0;
  let isFirstDone = false;

  for (let i = 0; i < nums.length; i++) {
    if (links === linksBetweenNums) {
      if (isFirstDone) linksBetweenNums++;

      currentDirection = NEXT_DIRECTION_FOR[currentDirection];
      isFirstDone = !isFirstDone;
      links = 0;
    }

    if (isPrime(nums[i])) {
      ctx.fillStyle = "#44475a";
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    if (options?.shouldHighlightStart && i === 0) {
      ctx.fillStyle = "#bd93f9";
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    if (!options?.shouldHideNumbers) {
      ctx.fillStyle = "#f8f8f2";
      ctx.fillText(
        nums[i],
        x * TILE_SIZE + halfTileSize,
        y * TILE_SIZE + halfTileSize
      );
    }

    if (currentDirection === DIRECTION_UP) {
      y--;
    } else if (currentDirection === DIRECTION_RIGHT) {
      x++;
    } else if (currentDirection === DIRECTION_BOTTOM) {
      y++;
    } else if (currentDirection === DIRECTION_LEFT) {
      x--;
    }

    links++;
  }
}
