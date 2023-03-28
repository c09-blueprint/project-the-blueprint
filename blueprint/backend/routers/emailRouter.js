import { Router } from "express";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";

export const emailRouter = Router();

// POST email using SendGrid

emailRouter.post("/", async (req, res) => {
  console.log("POST /api/emails");
  console.log("SENDGRID_API_KEY: ", process.env.REACT_APP_SENDGRID_API_KEY);
  //   const sgMail = require("@sendgrid/mail");
  sendgrid.setApiKey(
    "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"
  );
  //   sendgrid.setApiKey(process.env.REACT_APP_SENDGRID_API_KEY);

  const msg = {
    to: "christina_cm16@hotmail.com",
    from: "christina.bt.ma@gmail.com",
    templateId: "d-dbfa4d068370421caeada96a3451fbbe", // ID of your dynamic template in SendGrid
    dynamicTemplateData: {
      name: "Chris",
      URL: "http://localhost:3000/home",
    },
  };
  sendgrid
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  res.status(200).send("POST /api/emails");
});
