import { useLayoutEffect, useState } from "react";
import { BrowserRouterProps, Router } from "react-router-dom";
import { BrowserHistory, createBrowserHistory } from "history";
import customHistory from "./history";
import React from "react";

interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}
export function CustomRouter({
    basename,
    children,
    window
  }: BrowserRouterProps) {
    let historyRef = React.useRef<BrowserHistory>();
    if (historyRef.current == null) {
      historyRef.current = createBrowserHistory({ window });
    }
  
    let history = historyRef.current;
    let [state, setState] = React.useState({
      action: history.action,
      location: history.location
    });
  
    useLayoutEffect(() => history.listen(setState), [history])
  
    return (
      <Router
        basename={basename}
        children={children}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      />
    );
  }