import React from "react";
import BxDateTime from "./BxDateTime";
import BxStatsEntityLink from "./BxStatsEntityLink";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
/*import BxStatsHelpLink from "./BxStatsHelpLink";*/
import _ from 'lodash';

class BxStatsTable extends React.Component {
    render() {
        const {classes, globalStats} = this.props;

        let currentTpsKey = null;
        _.forEach(globalStats, (v, k) => {
            if (k && (k.indexOf("!txn-per-sec:") === 0)) {
                currentTpsKey = k;
            }
        });

        return (
            <Grid className={classes.sideBySideHeaderSecond}>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/ent-leader.png" alt="头部节点" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h3" className="headerTypography">
                        头部节点
                        <Typography component="p">
                            <BxStatsEntityLink node={globalStats['!ent-last-leader']} />
                        </Typography>
                    </Typography>
                </Grid>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/block-height.png" alt="区块高度" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h2" className="headerTypography">
                        区块高度
                        <Typography component="p">
                            {globalStats['!blk-last-slot'] || "0"}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/block-tps.png" alt="峰值TPS" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h2" className="headerTypography">
                        当前/峰值TPS
                        <Typography component="p">
                            {globalStats[currentTpsKey] || "0"}/{globalStats['!txn-per-sec-max'] || "0"}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/txn-count.png" alt="总交易" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h2" className="headerTypography">
                        总交易
                        <Typography component="p">
                            {globalStats['!txn-count'] || "0"}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/tick-height.png" alt="时间戳记录" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h2" className="headerTypography">
                        时间戳记录
                        <Typography component="p">
                            {globalStats['!ent-height'] || "-"}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid className={classes.sideBySideHeader}>
                    <img src="/images/icon/last-dt.png" alt="最近更新" className={classes.statsGridIcon}/>
                    <Typography variant="h6" component="h2" className="headerTypography">
                        最近更新
                        <Typography component="p" className="headerTypographyLast">
                            <BxDateTime dateTime={globalStats['!ent-last-dt']} fromNow />
                        </Typography>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default BxStatsTable;
