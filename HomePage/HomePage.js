import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AddEdit } from '../AddUsers/AddEdit';

import { userActions } from '../_actions';

class HomePage extends React.Component {
  componentDidMount() {
    this.props.getUsers();
  }

  handleDeleteUser(id) {
    return e => this.props.deleteUser(id);
  }
  //handleEditUser(id) {
  //alert(id);
  // return e => this.props.editUser(id);
  //}

  render() {
    console.log(this.props.users.items);
    const { user, users } = this.props;
    const userId = user.id;
    let userList = users.items;
    console.log('sdsds :: ', userList);
    return (
      <div>
        <nav class="navbar navbar-inverse">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" href="#">
                Hiii {user.firstName}!
              </a>
            </div>
            <ul class="nav navbar-nav navbar-right">
              <li>
                <Link to="/login">Logout</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <h3 class="mt0">Dashboard</h3>
            </div>
            <div class="col-md-6">
              <Link
                to="/users/add"
                className="btn btn-sm btn-success pull-right"
              >
                Add User
              </Link>
            </div>
          </div>

          {users.loading && <em>Loading users...</em>}
          {users.error && (
            <span className="text-danger">ERROR: {users.error}</span>
          )}
          {users.items && (
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>User name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.items.map((user, index) => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.deleting ? (
                        <em> - Deleting...</em>
                      ) : user.deleteError ? (
                        <span className="text-danger">
                          {' '}
                          - ERROR: {user.deleteError}
                        </span>
                      ) : (
                        <span>
                          {' '}
                          <Link
                            to={`/users/${user.id}`}
                            className="btn btn-info btn-sm"
                          >
                            Edit
                          </Link>
                          &nbsp;
                          {/* <a onClick={this.handleEditUser(user.id)}>Edit</a> */}
                          <a
                            class="btn btn-danger btn-sm"
                            onClick={this.handleDeleteUser(user.id)}
                          >
                            Delete
                          </a>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete
  //editUser: userActions.editUser
};

const connectedHomePage = connect(
  mapState,
  actionCreators
)(HomePage);
export { connectedHomePage as HomePage };
