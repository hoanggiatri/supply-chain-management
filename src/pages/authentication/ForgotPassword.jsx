import React from "react";
import ForgotPasswordForm from "@components/auth-form/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <section className="flex text-center h-screen justify-center items-center mt-4 p-8 bg-gray-50">
      <ForgotPasswordForm />
    </section>
  );
};

export default ForgotPassword;
