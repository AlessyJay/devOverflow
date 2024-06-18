import React from "react";

const page = ({ params, searchParams }: { params: any; searchParams: any }) => {
  return <div>{params.id}</div>;
};

export default page;
