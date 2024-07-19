import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <button onClick={() => signIn("github")}>
      Sign in with GitHub
    </button>
  );
};

export default LoginButton;