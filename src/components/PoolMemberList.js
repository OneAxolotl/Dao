import React from "react";
import { Grid, Image, Divider } from "semantic-ui-react";
import { Switch, Route, Link } from "react-router-dom";

import MemberDetail from "./MemberDetail";
import bull from "assets/bull.png";
import hood from "assets/hood.png";

import { Query, useQuery } from "react-apollo";
import { GET_POOL_MEMBER_DETAIL, GET_POOL_METADATA } from "../helpers/graphQlQueries";

const MemberAvatar = ({ address, shares }) => (
  <Grid.Column
    mobile={5}
    tablet={3}
    computer={3}
    textAlign="center"
    className="member_avatar"
    title={address}
  >
    <Link to={`/members/${address}`} className="uncolored">
      <Image src={hood} centered size="tiny" />
      <p className="name">
        {!address ? "" : address.length > 10 ? address.substring(0, 10) + "..." : address}
      </p>
      <p className="subtext">{shares} shares</p>
    </Link>
  </Grid.Column>
);

const LoggedInUser = props => (
  <Query query={GET_POOL_MEMBER_DETAIL} variables={{ address: props.loggedInUser }}>
    {({ loading, error, data }) => {
      if (loading) return "...";
      if (error) throw new Error(`Error!: ${error}`);
      return data.member ? (
        <Link to={`/members/${data.member.id}`} className="uncolored">
          <Image centered src={bull} size="tiny" />
          <p className="name">
            {!data.member.id
              ? ""
              : data.member.id.length > 10
              ? data.member.id.substring(0, 10) + "..."
              : data.member.id}
          </p>
          <p className="subtext">{data.member.shares ? data.member.shares : 0} shares</p>
        </Link>
      ) : (
        <div />
      );
    }}
  </Query>
);

const PoolMemberList = props => {
  const { loading, error, data } = useQuery(GET_POOL_METADATA);
  let members;
  if (error) {
    members = "NA";
    console.error(`Could not load members: ${error}`);
  } else if (loading) {
    members = "-";
  } else {
    members = data.members ? data.members.length : 0;
  }
  return (
    <div id="member_list">
      <Grid columns={16} verticalAlign="middle">
        <Grid.Column
          mobile={16}
          tablet={6}
          computer={6}
          textAlign="left"
          className="member_list_header"
        >
          <p className="subtext">{members} Members</p>
        </Grid.Column>
      </Grid>

      <Grid>
        <Grid.Column textAlign="center">
          <LoggedInUser {...props} />
        </Grid.Column>
      </Grid>
      <Grid className="member_item">
        <Grid.Row>
          <p style={{ paddingLeft: "1rem" }}>Pool Members</p>
        </Grid.Row>
        <Divider />
        <Grid.Row className="members_row" centered>
          {data.members && data.members.length > 0 ? (
            data.members.map((elder, idx) => (
              <MemberAvatar address={elder.id} shares={elder.shares} key={idx} />
            ))
          ) : (
            <>No pool members to show.</>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};

const PoolMemberListView = higherProps => (
  <Switch>
    <Route
      exact
      path="/pool-members"
      render={props => <PoolMemberList {...props} loggedInUser={higherProps.loggedInUser} />}
    />
    <Route
      path="/pool-members/:name"
      render={props => <MemberDetail {...props} loggedInUser={higherProps.loggedInUser} />}
    />
  </Switch>
);

export default PoolMemberListView;
