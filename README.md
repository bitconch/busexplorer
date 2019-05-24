# bus-explorer
block explorer for bitconch chain


```bash

npm install --save -g solgraph --unsafe-perm=true --allow-root


```

install nodejs and redis
```bash

apt-get --assume-yes install redis

```

Install Redis & Administration

Refer to https://redis.io/topics/admin

```bash
vim /etc/sysctl.conf

```
 Add ```vm.overcommit_memory =1``` to sysctl.conf

```
sysctl vm.overcommit_memory=1
```

* Redis Log 

Usually log file is defined in /etc/redis/redis.conf

default value ```logfile /var/log/redis/redis-server.log```

## install && start explorer
1. go to go/src/github.com/bitconch/
```bash
cd go/src/github.com/bitconch/
```
2. clone explorer
```bash
git clone https://github.com/bitconch/bus-explorer
```

3. build
go to the project root folder
```bash
cd bus-explorer
yarn
```

4. Start 
```bash
yarn start:api
```
open another terminal
```bash
yarn start:ui
```

run the bus instance, refer to bitcon/bus


### Anything Goes Wrong

1. Remove influxdb
```
sudo apt-get remove influxdb

sudo apt-get remove --auto-remove influxdb

sudo apt-get purge influxdb

sudo apt-get purge --auto-remove influxdb
```


2. Remove Redis

```
apt-get purge --auto-remove redis-server

```

3. Install Redis Server Again

```
apt-get install redis-server

```

4. Change The File Permission 


5. Update the Configuration File for Redis

```
vi /etc/redis/redis.conf

```

Remove ```bind 127.0.0.1 ::1``` with ```bind 127.0.0.1```


