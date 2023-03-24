// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

function sendEmail() {
  console.log("Sending email via SendGrid");
  fetch(`http://localhost:3001/api/emails/`, {
    method: "POST",
  }).then((res) => res.json());
}

const SGTest = () => {
  return (
    <div>
      <h1>SendGrid Test</h1>
      <button onClick={sendEmail}>Send Email via SendGrid</button>
    </div>
  );
};

export default SGTest;
