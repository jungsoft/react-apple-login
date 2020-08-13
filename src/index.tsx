import React, { useEffect } from "react";
import { generateQueryString } from "./helper";
import AppleButton from "./AppleButton";
import { DesignProp } from "./typings";

export interface AppleLoginProps {
  clientId: string;
  redirectURI: string;
  autoLoad?: boolean;
  scope?: string;
  state?: string;
  responseType?: string | "code" | "id_token";
  responseMode?: string | "query" | "fragment" | "form_post";
  nonce?: string;
  designProp?: DesignProp;
  callback?: (d: any) => void;
  render?: (props: {
    onClick: (e?: any) => void;
  }) => JSX.Element;
}

const AppleLogin = (props: AppleLoginProps) => {
  const {
    clientId,
    redirectURI,
    state = "",
    render,
    designProp = {},
    responseMode = "query",
    responseType = "code",
    nonce,
    callback,
    scope,
    autoLoad = false
  } = props;

  const onClick = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }
    window.location.href = `https://appleid.apple.com/auth/authorize?${generateQueryString(
      {
        response_type: responseType,
        response_mode: responseMode,
        client_id: clientId,
        redirect_uri: encodeURIComponent(redirectURI),
        state,
        nonce,
        scope: responseMode === "query" ? "" : scope
      }
    )}`;
  };

  useEffect(() => {
    if (autoLoad) {
      onClick();
    }

    if (
      typeof callback === "function" &&
      responseMode === "query" &&
      responseType === "code" &&
      window &&
      window.location
    ) {
      let match;
      const pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = (s: any) => {
          return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

      let urlParams = {};
      while ((match = search.exec(query))) {
        urlParams[decode(match[1])] = decode(match[2]);
      }
      if (urlParams["code"]) {
        callback({
          code: urlParams["code"]
        });
      }
    }
    return () => {};
  }, []);

  if (typeof render === "function") {
    return render({ onClick });
  }

  return (
    <div id="appleid-signin" onClick={onClick}>
      <AppleButton designProp={designProp} />
    </div>
  );
};

export default AppleLogin;
