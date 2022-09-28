import moment from "moment";
import React, { useEffect } from "react";
import {EXPIRES_AT_KEY, TOKEN_KEY } from "../constants";
import { withRouter } from "./with-router";

const AuthVerify = (props: any) => {
  let location = props.router.location;

  const getExpiration = () => {
    const expiration = localStorage.getItem(EXPIRES_AT_KEY);
    return moment(expiration);
  }

  const isExpired = () => {
    return !moment().isBefore(getExpiration());
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      if (isExpired()) {
        props.logOut();
      }
    }
  }, [location]);

  return <div></div>;
};

export default withRouter(AuthVerify);