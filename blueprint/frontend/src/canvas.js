import "./drawing.css";
import "./draw.js";

const Draw = () => {
  return (
    <div>
      <canvas id="canvas" className="board"></canvas>
      <script src="draw.js"></script>
    </div>
  );
};

export default Draw;
