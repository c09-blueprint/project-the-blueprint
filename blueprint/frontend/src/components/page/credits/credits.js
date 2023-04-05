import Navbar from "../navbar/navbar";

const Credits = () => {
  return (
    <div>
      <Navbar />
      <h1>Credits</h1>

      <h2>Resources for help with code</h2>
      <ul>
        <li>Used lecture notes and lab exercises as a guide and reference</li>
        <li>
          Used StackOverflow and ChatGPT to help resolve technical issues and
          debugging
        </li>
      </ul>

      <h2>Frontend Framework</h2>
      <ul>
        <li>
          Used <a href="https://getbootstrap.com/">Bootstrap </a>
          for all frontend styling
        </li>
      </ul>

      <h2>Images and Icons</h2>
      <li>
        The favicon created for Blueprint was created using this:{" "}
        <a href="https://favicon.io/favicon-generator/">favicon.io</a>
      </li>
      <ul>
        <li>
          All SVG icons seen on the board tool bar was created using this site:{" "}
          <a href="https://www.svgator.com/">svgator</a>
        </li>
        <li>
          The images on the landing page are from:{" "}
          <a href="https://www.flaticon.com/ ">flaticon</a>
        </li>
        <ul>
          <li>
            Image used under "Easy to Use":{" "}
            <a
              href="https://www.flaticon.com/free-icons/click-here"
              title="click here icons"
            >
              Click here icons created by kumakamu - Flaticon
            </a>
          </li>
          <li>
            Image used under "Real-time Collaboration":{" "}
            <a
              href="https://www.flaticon.com/free-icons/real-time"
              title="real time icons"
            >
              Real time icons created by afif fudin - Flaticon
            </a>
          </li>
          <li>
            Image used under "Video & Audio Call Simultaneously":{" "}
            <a
              href="https://www.flaticon.com/free-icons/voice-mail"
              title="voice mail icons"
            >
              Voice mail icons created by Eucalyp - Flaticon
            </a>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default Credits;
