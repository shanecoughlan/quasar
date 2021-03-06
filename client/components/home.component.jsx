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
const {History} = ReactRouter;
const {FontIcon, RaisedButton} = MUI;
const {Colors} = MUI.Styles;

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: Colors.fullWhite,
    height: '100%',
    minHeight: '300px',
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

let GlobalStyles = null;
let RoomStore = null;
let RoomActions = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomStore = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
});

HomeComponent = Radium(React.createClass({
  mixins: [ReactMeteorData, History],

  getMeteorData() {
    return {
      currentRoom: RoomStore.currentRoom.get(),
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.data.currentRoom) {
      this.history.pushState(null, '/room/' + this.data.currentRoom._id);
    }
  },

  createRoom() {
    RoomActions.createRoom();
  },

  render() {
    return (
      <div style={[styles.css]}>
        <GithubComponent />
        <div style={[GlobalStyles.stickyFooterPage]}>
          <HeaderComponent/>
          <div className='row'>
            <div className='col-xs-12 text-center'>
              <h1 style={[styles.title.css]}>{'quasar'}</h1>
              <br />
              <RaisedButton
                onTouchTap={this.createRoom}
                label='Start video call'
                primary={true}
              />
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  },
}));
