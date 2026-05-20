import { Suspense } from "react";
import ListQuestion from "./components/ListQuestion";

const ProblemPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading problems...</div>}>
        <ListQuestion />
      </Suspense>
    </div>
  );
};

export default ProblemPage;



