#!/bin/bash
DIR=`pwd`
NODE=`which node`
# get action
ACTION=$1

# help
usage() {
    echo 'Usage: ./app.sh {start|stop|restart|debug}'
    exit 1;
}

get_pid() {
    if [ -f ./app.pid ]; then
        echo `cat ./app.pid`
    fi
}

# start app
start() {
    pid=`get_pid`

    if [ ! -z $pid ]; then
        echo 'server is already running'
    else
        $NODE $DIR/app.js 2>&1 &
        echo 'server is running'
    fi
}

# stop app
stop() {
    pid=`get_pid`

    if [ -z $pid ]; then
        echo 'server not running'
    else
        echo 'server is stopping ...'
        kill -15 $pid
        echo 'server stopped!'
    fi
}

# restart app
restart() {
    stop
    sleep 0.5
    echo =====
    start
}

# debug
debug() {
    pid=`get_pid`

    if [ ! -z $pid ]; then
        echo 'server is already running'
    else
        $NODE --debug-brk $DIR/app.js 2>&1 &
        echo 'server is debugging'
    fi
}


case $ACTION in
    start)
        start
    ;;
    stop)
        stop
    ;;
    restart)
        restart
    ;;
    debug)
        debug
    ;;
    *)
        usage
    ;;
esac