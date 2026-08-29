import { Suspense } from "react";
import ServicesWrapper from "../../components/service/serviceswrapper";

export default function Services() {
  return (
    <Suspense fallback={null}>
      <ServicesWrapper />
    </Suspense>
  );
}
