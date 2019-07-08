import React, {Component} from 'react';
import axios from 'axios';
import {Router} from 'react-router-dom';
import {
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RobustWebSocket from 'robust-websocket';
import _ from 'lodash';
import {matchPath, Route} from 'react-router';
import './App.css';
import {createBrowserHistory} from 'history';
import {Connection} from '@bitconch/bitconch-web3j';

import EndpointConfig from './EndpointConfig';
import BxDataItem from './BxDataItem';
import BxTransactionChart from './BxTransactionChart';
import BxStatsGridTable from './BxStatsGridTable';
import BxDialog from './BxDialog';
import BxDialogTransactions from './BxDialogTransactions';
import BxDialogWorldMap from './BxDialogWorldMap';
import BxAppBar from './BxAppBar';
import {sleep} from './sleep';
import {styles,theme} from './themeStyle';

const history = createBrowserHistory();

async function geoip(ip: string) {
  let lat = 11.6065;
  let lng = 165.3768;
  try {
    const result = await window.fetch(
      `https:${BLOCK_EXPLORER_API_BASE}/geoip/${ip}`,
    );
    if (result.status === 200) {
      const json = await result.json();
      lat = json[0];
      lng = json[1];
      console.log(ip, 'at', lat, lng);
    }
  } catch (err) {
    console.log('geoip of', ip, 'failed with:', err);
  }
  //新增Math.random()随机数，防止数据重复
  return [lat + Math.random() / 10 - 0.05, lng + Math.random() / 10 - 0.05];
}

const BLOCK_EXPLORER_API_BASE = EndpointConfig.BLOCK_EXPLORER_API_BASE;

const BxAppBarThemed = withStyles(styles)(BxAppBar);
const BxDialogThemed = withStyles(styles)(BxDialog);
const BxDialogTransactionsThemed = withStyles(styles)(BxDialogTransactions);
const BxDialogWorldMapThemed = withStyles(styles)(BxDialogWorldMap);
const BxStatsGridTableThemed = withStyles(styles)(BxStatsGridTable);
const BxTransactionChartThemed = withStyles(styles)(BxTransactionChart);
// const BxDataTableThemed = withStyles(styles)(BxDataTable);
const BxDataItemThemed = withStyles(styles)(BxDataItem);

class App extends Component {
  constructor(props) {
    super(props);

    this.ws = null;
    this.connection = new Connection(EndpointConfig.BLOCK_EXPLORER_RPC_URL);

    this.state = {
      enabled: true,
      dialogOpen: false,
      selectedValue: null,
      currentMatch: null,
      stateLoading: false,
      nodes: [],
      globalStats: {
        '!ent-last-leader': null,
        '!blk-last-slot': 0,
        '!txn-count': 0,
        '!txn-per-sec-max': 0,
      },
      txnStats: {},
      users: [],
      userState: {},
      transactions: [],
      blocks: [],
    };

    const self = this;

    self.updateGlobalStats();
    self.updateTxnStats();
    self.updateBlocks();

    self.updateTransactions();
    setInterval(() => {
      self.updateTransactions();
    }, 10000);
  }

  getRemoteState(attr, url, mapFun, limit) {
    axios.get(url).then(response => {
      let newState = {};

      if (limit) {
        response.data = response.data.slice(0, limit);
      }

      if (mapFun) {
        newState[attr] = _.map(response.data, mapFun);
      } else {
        newState[attr] = response.data;
      }

      this.updateStateAttributes(newState);
    });
  }

  updateSpecificGlobalStateAttribute(attr, value) {
    let globalStats = {...this.state.globalStats};
    globalStats[attr] = value;

    this.updateStateAttributes({globalStats: globalStats});
  }

  updateStateAttributes(attrMap) {
    let newState = {...this.state};

    _.forEach(attrMap, (v, k) => {
      newState[k] = v;
    });

    this.setState(() => {
      return newState;
    });
  }

  async updateGlobalStats() {
    this.getRemoteState(
      'globalStats',
      `https:${BLOCK_EXPLORER_API_BASE}/global-stats`,
    );

    try {
      const oldNodes = this.state.nodes;
      const newNodes = await this.connection.getClusterNodes();
      const nodes = [];

      let modified = oldNodes.length !== newNodes.length;

      const maybeSetState = () => {
        if (modified) {
          this.setState({nodes});
          modified = false;
        }
      };
      for (const newNode of newNodes) {
        const oldNode = oldNodes.find(node => node.id === newNode.id);
        if (oldNode) {
          nodes.push(oldNode);
        } else {
          const ip = newNode.gossip.split(':')[0];
          const [lat, lng] = await geoip(ip);
          newNode.lat = lat;
          newNode.lng = lng;
          nodes.push(newNode);
          modified = true;
        }
        maybeSetState();
      }
      maybeSetState();
    } catch (err) {
      console.log('getClusterNodes failed:', err.message);
    }

    setTimeout(() => this.updateGlobalStats(), 1200);
  }

  updateTxnStats() {
    this.getRemoteState(
      'txnStats',
      `https:${BLOCK_EXPLORER_API_BASE}/txn-stats`,
    );
    setTimeout(() => this.updateTxnStats(), 22000);
  }

  updateBlocks() {
    if (!this.state.enabled) {
      return;
    }

    let blkFun = v => {
      let newObj = {};
      let fields = v.split('#');

      newObj.t = 'blk';
      newObj.h = fields[0];
      newObj.l = fields[1];
      newObj.s = fields[2];
      newObj.dt = fields[3];
      newObj.id = fields[4];

      return newObj;
    };

    this.getRemoteState(
      'blocks',
      `https:${BLOCK_EXPLORER_API_BASE}/blk-timeline`,
      blkFun,
      10,
    );
  }

  updateTransactions() {
    if (!this.state.enabled) {
      return;
    }

    let self = this;

    let txnFun = v => {
      return self.parseTransactionMessage(v);
    };

    this.getRemoteState(
      'transactions',
      `https:${BLOCK_EXPLORER_API_BASE}/txn-timeline`,
      txnFun,
      10,
    );
  }

  handleLocationChange = () => location => {
    if (location.pathname === '/' && this.selectedValue !== null) {
      this.updateStateAttributes({
        selectedValue: null,
        dialogOpen: false,
        currentMatch: null,
        stateLoading: false,
      });
    }

    if (location.pathname !== '/') {
      let pathMatch = matchPath(window.location.pathname, {
        path: '/:type/:id',
        exact: false,
        strict: false,
      });

      if (pathMatch) {
        if (pathMatch.params.type !== 'txns-by-prgid') {
          this.unsubscribeWebSocketTransactionsByProgramId();
        }

        this.updateStateAttributes({
          selectedValue: null,
          dialogOpen: false,
          currentMatch: pathMatch,
          stateLoading: true,
        });

        this.handleClickOpen(pathMatch.params.id, pathMatch.params.type)();
        this.updateStateAttributes({
          currentMatch: pathMatch,
          stateLoading: true,
        });
      }
    }
  };

  componentDidMount() {
    const self = this;

    if (!self.ws) {
      let ws = new RobustWebSocket(`wss:${BLOCK_EXPLORER_API_BASE}/`);

      ws.addEventListener('open', function() {
        ws.send(JSON.stringify({hello: 'world'}));
      });

      ws.addEventListener('message', function(event) {
        if (!self.state.enabled) {
          return;
        }

        self.onMessage(JSON.parse(event.data));
      });

      self.ws = ws;
    }

    if (!self.locationListener) {
      let locationListener = this.handleLocationChange();

      history.listen(locationListener);
      locationListener(window.location);

      self.locationListener = locationListener;
    }
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  onMessage = data => {
    if (!this.state.enabled) {
      return;
    }

    let type = data.t;

    if (type === 'blk') {
      this.addBlock(this.parseBlockMessage(data.m));
    }

    if (type === 'txns-by-prgid') {
      this.addTransactionByProgramId(this.parseTransactionMessage(data.m));
    }
  };

  parseBlockMessage(message) {
    let fields = message.split('#');

    return {
      t: 'blk',
      h: parseInt(fields[0]),
      l: fields[1],
      s: parseInt(fields[2]),
      dt: fields[3],
      id: fields[4],
    };
  }

  parseTransactionMessage(message) {
    let fields = message.split('#');

    let instructions = _.map(fields[6].split('|'), i => {
      let instParts = i.split('@');

      return {
        program_id: instParts[0],
        keys: instParts[1].split(','),
        data: instParts[2],
      };
    });

    return {
      t: 'txn',
      h: parseInt(fields[0]),
      l: fields[1],
      s: parseInt(fields[2]),
      dt: fields[3],
      entry_id: fields[4],
      id: fields[5],
      instructions,
    };
  }

  addBlock(block) {
    let blocks = [...this.state.blocks];

    if (blocks.length >= 10) {
      blocks.pop();
    }

    blocks.unshift(block);

    this.updateStateAttributes({blocks: blocks});
  }

  addTransactionByProgramId(txn) {
    let newValue = {...this.state.selectedValue};
    let newTxns = [...newValue.transactions];

    if (newTxns.length >= 100) {
      newTxns.pop();
    }

    newTxns.unshift(txn);
    newValue.transactions = newTxns;

    this.updateStateAttributes({selectedValue: newValue});
  }

  unsubscribeWebSocketTransactionsByProgramId() {
    if (
      !this.state.selectedValue ||
      this.state.selectedValue.t !== 'txns-by-prgid'
    ) {
      return;
    }

    let msg = JSON.stringify({
      action: 'unsubscribe',
      type: this.state.selectedValue.t,
      id: this.state.selectedValue.id,
    });

    console.log('unsubscribe ' + msg);
    this.ws.send(msg);
  }

  handleDialogClose = () => {
    console.log('dialog close');

    if (
      this.state.selectedValue &&
      this.state.selectedValue.t === 'txns-by-prgid'
    ) {
      this.unsubscribeWebSocketTransactionsByProgramId();
    }

    this.updateStateAttributes({
      selectedValue: null,
      dialogOpen: false,
      currentMatch: null,
      stateLoading: false,
    });

    history.push('/');
  };

  showMap = () => () => {
    history.push(`/map`);
  };

  toggleEnabled = self => event => {
    if (event.target.checked === self.state.enabled) {
      return;
    }

    this.updateStateAttributes({
      enabled: event.target.checked,
    });
  };

  handleSearch = () => event => {
    let value = event.target.value;
    event.target.value = '';

    if (value === null || value.length === 0) {
      return;
    }

    let url = `${BLOCK_EXPLORER_API_BASE}/search/${value}`;

    axios.get(url).then(response => {
      let result = response.data;
      history.push(`/${result.t}/${result.id}`);
    });
  };

  handleClickOpen = (value, type) => () => {
    const self = this;

    let mkUrl = (id, type) => {
      let url = null;

      if (type === 'txns-by-prgid') {
        url = `${BLOCK_EXPLORER_API_BASE}/txns-by-prgid/${id}`;
      }

      if (type === 'txn') {
        url = `${BLOCK_EXPLORER_API_BASE}/txn/${id}`;
      }

      if (type === 'ent') {
        url = `${BLOCK_EXPLORER_API_BASE}/ent/${id}`;
      }

      if (type === 'blk') {
        url = `${BLOCK_EXPLORER_API_BASE}/blk/${id}`;
      }

      return url;
    };

    let url = mkUrl(value, type);

    let updateState = async newVal => {
      if (type === 'txns-by-prgid') {
        let msg = JSON.stringify({
          action: 'subscribe',
          type: type,
          id: value,
        });

        console.log('subscribe', msg);
        while (self.ws.readyState !== WebSocket.OPEN) {
          console.log(
            'Waiting for ws.readyState to be OPEN (1): ',
            self.ws.readyState,
          );
          await sleep(250);
        }
        self.ws.send(msg);

        let txns = _(newVal)
          .map(v => this.parseTransactionMessage(v))
          .value();

        let newSelectedValue = {
          t: type,
          id: value,
          transactions: txns,
        };

        self.updateStateAttributes({
          selectedValue: newSelectedValue,
          dialogOpen: true,
          stateLoading: false,
        });
      } else {
        self.updateStateAttributes({
          selectedValue: newVal,
          dialogOpen: true,
          stateLoading: false,
        });
      }
    };

    axios
      .get(url)
      .then(response => updateState(response.data))
      .catch((resp, err) => {
        console.error('oops', resp, err);
      });
  };

  render() {
    let self = this;
    const leaderId = this.state.globalStats['!ent-last-leader'];

    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <div className="App">
            <BxAppBarThemed
              handleSearch={self.handleSearch(self)}
              enabled={this.state.enabled}
              handleSwitch={this.toggleEnabled(self)}
              handleMap={this.showMap(self)}
            />
            <div>
              <Route
                path="/map"
                render={() => (
                  <BxDialogWorldMapThemed
                    open={true}
                    onClose={self.handleDialogClose}
                    nodes={this.state.nodes}
                    leaderId={leaderId}
                  />
                )}
              />
              <Route
                path="/txn/:id"
                exact
                render={() => (
                  <BxDialogThemed
                    selectedValue={self.state.selectedValue}
                    open={self.state.dialogOpen}
                    onClose={self.handleDialogClose}
                  />
                )}
              />
              <Route
                path="/blk/:id"
                exact
                render={() => (
                  <BxDialogThemed
                    selectedValue={self.state.selectedValue}
                    open={self.state.dialogOpen}
                    onClose={self.handleDialogClose}
                  />
                )}
              />
              <Route
                path="/ent/:id"
                exact
                render={() => (
                  <BxDialogThemed
                    selectedValue={self.state.selectedValue}
                    open={self.state.dialogOpen}
                    onClose={self.handleDialogClose}
                  />
                )}
              />
              <Route
                path="/txns-by-prgid/:id"
                exact
                render={() => (
                  <BxDialogTransactionsThemed
                    selectedValue={self.state.selectedValue}
                    open={self.state.dialogOpen}
                    onClose={self.handleDialogClose}
                  />
                )}
              />
            </div>
            <p />
            <div style={{marginLeft:'20px',marginRight:'20px'}}>
              <BxStatsGridTableThemed
                globalStats={this.state.globalStats}
                nodeCount={this.state.nodes.length}
              />
              <p />
              <div style={{marginTop:'22px'}}>
                <div style={{float:'left',width:'49%'}}>
                  <BxTransactionChartThemed txnStats={this.state.txnStats} />
                  <Grid container spacing={16} justify="center">
                      <Grid item style={{width: '1460px',marginTop:'22px',padding:'0px'}}>
                          <BxDataItemThemed
                              dataType="blk"
                              dataItems={this.state.blocks}
                          />
                      </Grid>
                  </Grid>
                </div>
                <Grid container spacing={16} justify="center" style={{width:'49%',float:'left',marginLeft:'22px'}}>
                    <Grid item style={{width: '1460px'}}>
                        <BxDataItemThemed
                            dataType="txn"
                            dataItems={this.state.transactions}
                        />
                    </Grid>
                </Grid>
              </div>
              <p />
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
