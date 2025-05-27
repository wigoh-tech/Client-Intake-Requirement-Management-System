"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import swaggerDocument from "@/swagger/swagger.json";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  return <SwaggerUI spec={swaggerDocument} />;
}
