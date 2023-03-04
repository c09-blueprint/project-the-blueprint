window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // get the current canvas offsets using getBoundingClientRect
  const BB = canvas.getBoundingClientRect();
  const offsetX = BB.left;
  const offsetY = BB.top;

  let painting = false;

  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    let mouseX = parseInt(e.clientX - offsetX);
    let mouseY = parseInt(e.clientY - offsetY);

    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
});
