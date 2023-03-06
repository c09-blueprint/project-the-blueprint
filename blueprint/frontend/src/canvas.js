import "./drawing.css";
import "./draw.js";

const Draw = () => {
  return (
    <div>
      <button id="reset">Reset</button>
      <button id="restore">Restore</button>
      <button id="save">Save</button>
      <button id="red">Red</button>
      <canvas id="canvas" className="board"></canvas>
    </div>
  );
};

export default Draw;
