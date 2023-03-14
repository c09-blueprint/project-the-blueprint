import { fabric } from "fabric";
(function () {
  window.addEventListener("load", function () {
    let json = null;
    document.getElementById("reset").addEventListener("click", () => {
      console.log("reset");
      canvas.clear();
    });
    document.getElementById("restore").addEventListener("click", () => {
      console.log("restore");
      canvas.loadFromJSON(json);
      console.log("restore DONE");
    });
    document.getElementById("save").addEventListener("click", () => {
      console.log("save");
      json = JSON.stringify(canvas.toJSON());
      console.log(json);
    });
    document.getElementById("red").addEventListener("click", () => {
      let textbox = new fabric.Textbox("Type your text here", {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 20,
        textAlign: "left",
        editable: true,
      });

      canvas.add(textbox);
    });
    document.getElementById("reactON").addEventListener("click", () => {
      document.getElementById("canvas-overlay").classList.remove("overlay");
      document.getElementById("react-layer").classList.add("overlay");
    });
    document.getElementById("reactOFF").addEventListener("click", () => {
      document.getElementById("canvas-overlay").classList.add("overlay");
      document.getElementById("react-layer").classList.remove("overlay");
    });
    document.getElementById("drawOFF").addEventListener("click", () => {
      canvas.isDrawingMode = false;
      canvas.renderAll();
    });
    document.getElementById("drawON").addEventListener("click", () => {
      canvas.isDrawingMode = true;
      canvas.renderAll();
    });
    // Resizing
    const cnv = document.getElementById("canvas");
    cnv.height = window.innerHeight;
    cnv.width = window.innerWidth;

    const canvas = new fabric.Canvas("canvas");

    canvas.on("after:render", function () {
      console.log("Canvas was rendered");
    });
  });
})();
