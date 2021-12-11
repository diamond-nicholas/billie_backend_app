import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

const phoneNumber = getPhoneNumberFromUserInput();
const appVerifier = window.recaptchaVerifier;

const auth = getAuth();
signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  .then((confirmationResult) => {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    window.confirmationResult = confirmationResult;
    // ...
  })
  .catch((error) => {
    console.log(error);
    // Error; SMS not sent
    // ...
  });
