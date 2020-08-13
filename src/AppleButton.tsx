import React from "react";

import { generateQueryString } from "./helper";
import { DesignProp } from "./typings";

export interface AppleButtonProps {
  designProp?: DesignProp;
}

const AppleButton = ({
  designProp,
}: AppleButtonProps) => (
  <img
    src={`https://appleid.cdn-apple.com/appleid/button?${generateQueryString(
      designProp
    )}`}
  />
);

export default AppleButton;
