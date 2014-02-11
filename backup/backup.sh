#!/bin/sh
 
MONGODB_SHELL='mongo'
DUMP_UTILITY='mongodump'

DB_NAME='kiwiobject'
SERVER_USER='wangjian'
HOST_NAME='42.121.30.57'

date_now=`date +%Y_%m_%d_%H_%M_%S`
BASE_PATH='/root/mongodb/'
BACKUP_PATH=${BASE_PATH}${date_now}
BACKUP_FILENAME=${BASE_PATH}${date_now}'.bz2'
current_year=`date +%Y`

log() {
    echo $1
}

do_cleanup(){
    rm -rf ${current_year}*
    log 'cleaning up....'
}

do_backup(){
    log 'snapshotting the db and creating archive' && \
    ${MONGODB_SHELL} admin fsync_lock.js && \
    log 'db locked and creating backup' 
    ${DUMP_UTILITY} -d ${DB_NAME} -o ${BACKUP_PATH} && tar -jcf ${BACKUP_FILENAME} ${BACKUP_PATH} && \
    ${MONGODB_SHELL} admin fsync_unlock.js && \
    log 'data backd up and created snapshot'
}

save_in_cloud(){
    log 'saving backup to another server...'
    scp ${DIR}/${BACKUP_FILENAME} ${SERVER_USER}@${HOST_NAME}:${CLOUD_PATH}/${BACKUP_FILENAME}
    log 'saved scuccessfully'
}

# do_backup && save_in_cloud && do_cleanup
do_backup