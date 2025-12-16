import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@components/auth-form/RegisterForm";

const Register = () => {
  return (
    <AuthLayout maxWidth="32rem">
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
