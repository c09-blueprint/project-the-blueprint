import sendgrid from "@sendgrid/mail";

const sendInviteEmail = async (req, res, next) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const email = req.body.email;
  const msg = {
    to: email,
    from: "christina.bt.ma@gmail.com",
    templateId: "d-dbfa4d068370421caeada96a3451fbbe",
    dynamicTemplateData: {
      URL: req.body.url,
    },
  };

  await sendgrid.send(msg);
  res.status(200).send("COMPLETED sendInviteEmail");
};

export const emailController = {
  sendInviteEmail,
};
