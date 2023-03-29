import "./landingPage.css";
import React from "react";
import "../styles/cols.css";
import NavbarHome from "../navbar/navbarHome";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <NavbarHome />
      <header className="masthead">
        <div className="container px-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="text-lg-start">
                <h1 className="display-1 lh-1 mb-3">Visualize your ideas.</h1>
                <p className="lead fw-normal text-muted mb-5">
                  Blueprint is a collaborative whiteboarding tool for
                  brainstorming. Create interactive diagrams such as flowcharts
                  and mind-maps and share them with anyone!
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div>
                <img
                  src={require("./images/reactflow-example.png")}
                  alt="React Flow Example"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="container text-center">
        <div class="row">
          <div class="col-lg-4">
            <div class="mx-auto mb-5 mb-lg-0 mb-lg-3 feature-padding">
              <div className="icon-margin">
                <img
                  src={require("./images/voice-message.png")}
                  alt="Audio Call icon"
                  className="features-icons"
                />
              </div>
              <h3>Audio Call Simultaneously</h3>

              <p class="lead mb-0">
                Hop on a call with your team and brainstorm together with our
                integrated audio call feature!
              </p>
              <a
                href="https://www.flaticon.com/free-icons/voice-mail"
                title="voice mail icons"
              >
                Voice mail icons created by Eucalyp - Flaticon
              </a>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3 feature-padding">
              <div className="icon-margin">
                <img
                  src={require("./images/time-management.png")}
                  alt="Audio Call icon"
                  className="features-icons"
                />
              </div>
              <h3>Real-Time Collaboration</h3>
              <p class="lead mb-0">
                Multiple users can work on the same whiteboard simultaneously
                and see each other's changes in real-time!
              </p>
              <a
                href="https://www.flaticon.com/free-icons/real-time"
                title="real time icons"
              >
                Real time icons created by afif fudin - Flaticon
              </a>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="features-icons-item mx-auto mb-0 mb-lg-3 feature-padding">
              <div className="icon-margin">
                <img
                  src={require("./images/touch.png")}
                  alt="Audio Call icon"
                  className="features-icons"
                />
              </div>
              <h3>Easy to Use</h3>
              <p class="lead mb-0">
                Blueprint is easy to use and intuitive. Simply drag and drop to
                create your diagrams!
              </p>
              <a
                href="https://www.flaticon.com/free-icons/click-here"
                title="click here icons"
              >
                Click here icons created by kumakamu - Flaticon
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="container text-center">
        <h1 class="mb-5">What people are saying...</h1>
        <div class="row">
          <div class="col-lg-4">
            <div class="testimonial-item mx-auto mb-5 mb-lg-0">
              <h4>Samantha L.</h4>
              <p class="font-weight-light mb-0">
                "This is fantastic! I'm able to present my ideas to my team in a
                way that is easy to understand!"
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="testimonial-item mx-auto mb-5 mb-lg-0">
              <h4>Carl K.</h4>
              <p class="font-weight-light mb-0">
                "Blueprint is amazing! I've been using it to create all of my
                business plans!"
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="testimonial-item mx-auto mb-5 mb-lg-0">
              <h4>Katie Q.</h4>
              <p class="font-weight-light mb-0">
                "I love the audio call feature! It make it so easy to brainstorm
                with my team!"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container position-relative text-center ready-banner">
        <div class="row justify-content-center">
          <div class="col-xl-6">
            <h2 class="mb-4 display-3 ">Ready to get started?</h2>
            <button type="button" class="btn btn-primary btn-lg btn-info">
              Join Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;