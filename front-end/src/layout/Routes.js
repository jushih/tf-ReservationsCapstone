import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Search from "../search/Search";
import Reservation from "../reservations/Reservation";
import ReservationEdit from "../reservations/ReservationEdit";
import Seat from "../seat/Seat";
import Table from "../tables/Table";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/new">
        <Reservation />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route exact={true} path="/tables/new">
        <Table />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
