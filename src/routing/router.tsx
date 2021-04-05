import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard  from "../pages/Dashboard";
export interface IRouterState { }

export interface IRouterProps { }

export class Router extends React.Component<IRouterProps, IRouterState> {
    render() {
        return (
            <>
                <BrowserRouter key="BrowserRouter">
                    <Switch key="Switch">
                        <Route exact path="/" component={Dashboard} />
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}