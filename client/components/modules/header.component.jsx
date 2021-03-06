/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

// Dependencies
const {Link} = ReactRouter;
const {
  AppBar,
  Avatar,
  Card,
  CardActions,
  CardText,
  FlatButton,
  FontIcon,
  IconButton,
  IconMenu,
  LeftNav,
  Menu,
  MenuItem
} = MUI;

const Colors = MUI.Styles.Colors;

const styles = {
  css: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
  },

  icon: {
    css: {
      color: Colors.fullWhite,
    },
  },

  menu: {
    css: {
      color: Colors.fullBlack,
    },

    paper: {
      css: {
        maxHeight: '300px',
        overflowX: 'hidden',
        overflowY: 'auto',
        textOverflow: 'ellipsis',
      },
    },
  }
};

let Style = Radium.Style;
let dropdownStyleComponent = (
  <Style
    scopeSelector='.dropdown'
    rules={{
      '.dropdown-menu': {
        left: 'inherit',
        right: 0,
      },

      '.dropdown-toggle': {
        cursor: 'pointer',
      },
    }}
  />
);

let GlobalStyles = null;
let RoomActions = null;
let UserStore   = null;
let UserActions = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

NotificationDropdownComponent = Radium(React.createClass({
  componentDidMount() {
    var _this = this;
    this.interval = window.setInterval(function() {
      _this.setState({lastUpdated: new Date()});
    }, 1000);
  },

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  },

  joinRoom(r) {
    RoomActions.joinRoom(r);
  },

  render() {
    return (
      <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
        {dropdownStyleComponent}
        <IconButton iconStyle={styles.icon.css} iconClassName='material-icons dropdown-toggle' data-toggle='dropdown'>{(this.props.history && this.props.history.length) ? 'notifications' : 'notifications_none'}</IconButton>
        <Card className='dropdown-menu' style={styles.menu.paper.css}>
          {(!!this.props.history && this.props.history.length) ? _.map(this.props.history, (item)=> {
            return (
              <MenuItem
                key={item.createdAt}
                primaryText= {item.room + ' - ' + moment(item.createdAt).fromNow()}
                onTouchTap={this.joinRoom.bind(this, item.room)} />
            );
          }) :

        <MenuItem className='text-center'>
            No recent rooms
                    </MenuItem>}
                </Card>
            </div>
  );
  },
}));

ProfileDropdownComponent = Radium(React.createClass({
  logout() {
    UserActions.logout();
  },

  render() {
    return (
      <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
        {dropdownStyleComponent}
        <Avatar className='dropdown-toggle' data-toggle='dropdown' src={this.props.user.services.google.picture}/>
        <Card className='dropdown-menu'>
          <CardText>
            {this.props.user.profile.name}
          </CardText>
          {!!this.props.user.services.google && !!this.props.user.services.google.email && <CardText>
            {this.props.user.services.google.email}
          </CardText>}
          <CardActions className='text-center' expandable={false}>
            <FlatButton onTouchTap={this.logout} label='Sign out'/>
          </CardActions>
        </Card>
      </div>
    );
  },
}));

HeaderComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getMeteorData() {
    return {
      user: UserStore.user(),
      loggingIn: UserStore.loggingIn(),
      subscribed: UserStore.subscribed.get(),
    };
  },

  loginWithGoogle() {
    UserActions.loginWithGoogle();
  },

  loginWithFacebook() {
    UserActions.loginWithFacebook();
  },

  toggleNav() {
    this.refs.leftNav.toggle();
  },

  render() {
    let {...other} = this.props;

    let loginButton;
    let notificationDropdown;
    let avatarButton;
    let profileButtons;

    let menuItems = [
      {route: 'get-started', text: 'Get Started'},
      {route: 'customization', text: 'Customization'},
      {route: 'components', text: 'Components'},
    ];

    if (!UserStore.loggingIn() && this.data.subscribed) {
      if (this.data.user && !UserStore.isGuest()) {

        notificationDropdown = !!this.data.user.history ? (
          <NotificationDropdownComponent history={this.data.user.history.reverse()}/>
        ) : '';

        profileDropdown = (
          <ProfileDropdownComponent user={this.data.user} />
        );

        profileButtons = (
          <div style={[GlobalStyles.table]}>
            {notificationDropdown}
            {profileDropdown}
          </div>
        );
      } else {
        loginButton = <FlatButton label='Login with Google' onClick={this.loginWithGoogle}/>;
      }
    }

    return (
      <header>
        <AppBar title={''} iconElementRight={loginButton ? loginButton : profileButtons} onLeftIconButtonTouchTap={this.toggleNav} showMenuIconButton={false}
        style={styles.css} />
        <LeftNav ref='leftNav' docked={false} menuItems={menuItems} />
      </header>
    );
  },
}));
