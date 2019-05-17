import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';

class BxAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

    handleSearch = (event) => {
        if (this.props.handleSearch) {
            this.props.handleSearch(event);
        }
    };

  handleSwitch = event => {
    if (this.props.handleSwitch) {
      this.props.handleSwitch(event);
    }
  };

  handleProfileMenuOpen = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({mobileMoreAnchorEl: event.currentTarget});
  };

  handleMobileMenuClose = () => {
    this.setState({mobileMoreAnchorEl: null});
  };

  render() {
    const {anchorEl, mobileMoreAnchorEl} = this.state;
    const {classes} = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.headBackGround}>
          <Grid container justify="center">
            <Grid item style={{width: '1520px'}}>
            	<Toolbar>
                	<div>
                                    <a href="http://bitconch.io" target="_new">
                                        <img src="/bitconch-logo.svg" alt="Bitconch Logo" style={{"width": "54px"}}/>
                                    </a>
                                </div>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                  <InputBase
                    placeholder="查找…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onKeyPress={ev => {
                      if (ev.key === 'Enter') {
                        this.handleSearch(ev);
                        ev.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className={classes.grow} />
              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}
BxAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default BxAppBar;
