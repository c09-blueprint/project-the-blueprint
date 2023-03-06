window.addEventListener("load", function () {
  document.getElementById("reset").addEventListener("click", () => {
    console.log("reset");
    ctx.reset(); // Clear the context!
  });
  document.getElementById("restore").addEventListener("click", () => {
    console.log("restore");
    ctx.restore(); // Clear the context!
  });
  document.getElementById("save").addEventListener("click", () => {
    console.log("save");
    ctx.save(); // Clear the context!
  });
  document.getElementById("red").addEventListener("click", () => {
    console.log("red");
    ctx.strokeStyle = "red"; // Clear the context!
  });
  document.getElementById("drawOFF").addEventListener("click", () => {
    document.getElementById("canvas-overlay").classList.remove("overlay");
    document.getElementById("react-layer").classList.add("overlay");
  });
  document.getElementById("drawON").addEventListener("click", () => {
    document.getElementById("canvas-overlay").classList.add("overlay");
    document.getElementById("react-layer").classList.remove("overlay");
  });

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
