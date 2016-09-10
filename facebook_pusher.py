# coding: utf-8
""" Pushes events to the server. """
import json
import os


# parsed data folder (relative or absolute path)
DATA_PATH = os.path.join('data')
# parsed data file name
FILE_NAME = 'facebook.json'
CACHE_FILE_NAME = '~cache.json'
# WIGO token
with open(os.path.join('tokens', 'wigo_token.txt'), 'r') as f:
    TOKEN = f.readline()


with open(os.path.join(DATA_PATH, FILE_NAME), 'r') as f:
    events = json.load(f)

try:
    with open(os.path.join(DATA_PATH, CACHE_FILE_NAME), 'r') as f:
        pushed_events_ids = json.load(f)
except IOError:
    pushed_events_ids = []


def push_event(event):
    """ Push event to WIGO server. """
    # TODO: implement
    print 'Event "%s" has been pushed to server.' % str(event['id'])

for event in events:
    if event['id'] in pushed_events_ids:
        continue
    push_event(event)
    pushed_events_ids.append(event['id'])

with open(os.path.join(DATA_PATH, CACHE_FILE_NAME), 'w') as f:
    json.dump(pushed_events_ids, f)
