
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    console.log("Redirecionando para a página de login...");
  }, []);

  return <Navigate to="/login" replace />;
};

export default Index;
