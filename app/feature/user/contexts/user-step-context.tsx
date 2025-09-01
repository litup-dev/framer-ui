import { createContext, useState } from "react";

interface UserStepContextType {
  step: number;
  setStep: (step: number) => void;
  reset: () => void;
  backStep: () => void;
}

const UserStepContext = createContext<UserStepContextType>({
  step: 1,
  setStep: () => {},
  reset: () => {},
  backStep: () => {},
});

const UserStepProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStepState] = useState(0);

  const reset = () => {
    setStepState(0);
  };

  const backStep = () => {
    setStepState(step - 1);
  };

  const setStep = (newStep: number) => {
    setStepState(newStep);
  };

  return (
    <UserStepContext.Provider value={{ step, setStep, reset, backStep }}>
      {children}
    </UserStepContext.Provider>
  );
};

export { UserStepContext, UserStepProvider };
