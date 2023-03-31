// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// import { getMe } from "../../../reducers/userReducer";
import { useAuth0 } from "@auth0/auth0-react";
import { getAuthHeader } from "../utils/authService";
import axios from "axios";

// function sendEmail() {
//   console.log("Sending email via SendGrid");
//   fetch(`http://localhost:3001/api/emails/`, {
//     method: "POST",
//   }).then((res) => res.json());
// }

const SGTest = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const sendEmail = async () => {
    console.log("Sending email via SendGrid");
    const accessToken = await getAccessTokenSilently();
    const res = await axios.post(
      "http://localhost:3001/api/invite/",
      {
        email: "christina_cm16@hotmail.com",
        url: "http://localhost:3000/home",
      },
      getAuthHeader(user.email, accessToken)
    );
    console.log(res.data);
    console.log("Email sent!");
  };

  return (
    <div>
      <h1>SendGrid Test</h1>
      <button onClick={sendEmail}>Send Email via SendGrid</button>
    </div>
  );
};

export default SGTest;
