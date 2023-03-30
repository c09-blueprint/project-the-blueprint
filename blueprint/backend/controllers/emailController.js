import sendgrid from "@sendgrid/mail";

const sendInviteEmail = async (req, res, next) => {
  console.log("entered sendInviteEmail");
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("req.body.email: ", req.body.email);
  const email = req.body.email;
  console.log("req.body.url: ", req.body.url);
  const msg = {
    to: req.body.email,
    from: "christina.bt.ma@gmail.com",
    templateId: "d-dbfa4d068370421caeada96a3451fbbe",
    dynamicTemplateData: {
      URL: req.body.url,
    },
  };
  sendgrid
    .send(msg)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error(error);
    });
  res.status(200).send("COMPLETED sendInviteEmail");
};

export const emailController = {
  sendInviteEmail,
};
