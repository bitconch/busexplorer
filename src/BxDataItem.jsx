import React from 'react';
import PropTypes from 'prop-types';
import BxDateTime from './BxDateTime';
import BxEntityLink from './BxEntityLink';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';

class BxDataItem extends React.Component {
    renderBlocks() {
        const {classes, dataItems} = this.props;
        return (
                <Grid className={classes.dataListItemGrid}>
                    <Grid id="tableTitle" className={classes.dataListItemTitles}>
                        <img src="/images/icon/block.png" alt="最新区块" className={classes.dataListItemIcon}/>
                        <Typography variant="h6" className={classes.dataListItemTitle}>最新区块</Typography>
                    </Grid>
                    <List>
                        {_.map(dataItems, row => (
                            <ListItem key={row.id} className={classes.dataListItem}>
                                <ListItemText>
                                    <Typography className={classes.dataTableCell}>
                                        区块ID：<BxEntityLink blk={row.id} />
                                    </Typography>
                                    <Typography className={classes.dataTableCell}>
                                        区块高度：{row.s}
                                    </Typography>
                                    <Typography className={classes.dataTableCell}>
                                    生成时间：{BxDateTime.formatDateTime(row.dt, {style:BxDateTime.ISO8601_FMT, local:true})}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                            ))
                        }
                    </List>
                </Grid>
        );
    }

    renderEntries() {
        const {classes, dataItems} = this.props;
        return (
                <Grid className={classes.dataListItemGrid}>
                    <Grid id="tableTitle" className={classes.dataListItemTitles}>
                        <img src="/images/icon/entry.png" alt="最新记录" className={classes.dataListItemIcon}/>
                        <Typography variant="h6" className={classes.dataListItemTitle}>最新记录</Typography>
                    </Grid>
                    <List>
                        {_.map(dataItems, row => (
                            <ListItem key={row.id} className={classes.dataListItem}>
                                <ListItemText className={classes.dataListItemText}>
                                    <Typography className={classes.dataTableCell}>
                                    记录ID：<BxEntityLink ent={row.id} />
                                    </Typography>
                                    <Grid style={{display: "flex"}}>
                                        <Grid style={{width: "50%"}}>
                                            <Typography className={classes.dataTableCell}>
                                                区块高度：{row.s}
                                            </Typography>
                                            <Typography className={classes.dataTableCell}>
                                                时间戳记录数：{row.h}
                                            </Typography>
                                        </Grid>
                                        <Grid style={{width: "50%",marginLeft: "10px"}}>
                                            <Typography className={classes.dataTableCell}>
                                                交易数量：{row.txn_count}
                                            </Typography>
                                            <Typography className={classes.dataTableCell} alt="{BxDateTime.formatDateTime(row.dt, {style:BxDateTime.ISO8601_FMT, local:true})}">
                                                发起时间：{BxDateTime.formatDateTime(row.dt, {style:BxDateTime.ISO8601_FMT, local:true})}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItemText>
                            </ListItem>
                        ))
                        }
                    </List>
                </Grid>
        );
    }

    renderTransactions() {
        const {classes, dataItems} = this.props;

        return (
            <Grid className={classes.dataListGrid}>
                <Grid id="tableTitle" className={classes.dataListItemTitles}>
                    <img src="/images/icon/transaction.png" alt="最新交易" className={classes.dataListItemIcon}/>
                    <Typography variant="h6" className={classes.dataListItemTitle}>最新交易(每10s更新)</Typography>
                </Grid>
                <List>
                    {_.map(dataItems, row => (
                        <ListItem key={row.id} className={classes.dataListItem}>
                            <ListItemText>
                                <Typography className={classes.dataTableCell}>
                                    交易ID：<BxEntityLink txn={row.id} />
                                </Typography>
                                <Typography className={classes.dataTableCell}>
                                    区块高度：{row.s}
                                </Typography>
                                <Typography className={classes.dataTableCell}>
                                    发起时间：{BxDateTime.formatDateTime(row.dt, {style:BxDateTime.ISO8601_FMT, local:true})}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    ))
                    }
                </List>
            </Grid>
        );
    }

    render() {
        const {dataType} = this.props;

        if (dataType === 'blk') {
            return this.renderBlocks();
        }

        if (dataType === 'ent') {
            return this.renderEntries();
        }

        if (dataType === 'txn') {
            return this.renderTransactions();
        }

        return (
            <Paper>
                <Typography variant="h6" id="tableTitle" style={{textAlign: 'left'}}>
                    (ERROR - No data.)
                </Typography>
            </Paper>
        );
    }
}

BxDataItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default BxDataItem;
