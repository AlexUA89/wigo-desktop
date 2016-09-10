"""
Parses events from facebook graph API.

How to use?
1. Go to https://developers.facebook.com/tools/explorer/ and generate token.
   Save token into "tokens/facebook_token.txt" file in the repository root.
2. Execute this file. Events should be saved in "data/facebook.json" file.
"""
import json
import os
import requests


# facebook token
with open(os.path.join('tokens', 'facebook_token.txt'), 'r') as f:
    TOKEN = f.readline()
# parsed data folder (relative or absolute path)
DATA_PATH = os.path.join('data')
# parsed data file name
FILE_NAME = 'facebook.json'

URL = 'https://graph.facebook.com/search'
LOCATIONS = ('kiev', 'kyiv')
TYPE = 'event'
ADDITIONAL = {'debug': 'all', 'format': 'json', 'limit': 1000}


def get_events(request_count=5):
    print 'About to get events from facebook ...'
    events = []
    for location in LOCATIONS:
        params = {
            'q': location,
            'type': TYPE,
            'access_token': TOKEN,
        }
        params.update(ADDITIONAL)
        for _ in range(request_count):
            response = requests.get(URL, params=params)
            response_json = response.json()
            data = response_json['data']
            if not data:
                break
            print '  Successfully downloaded %s events from %s' % (len(data), response.request.url)
            events += data
            after = response_json['paging']['cursors']['after']
            params['after'] = after
    print '... Successfully parsed all events from facebook.'
    return events


def _create_path_if_not_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)


def _merge_events(old_events, new_events):
    """ Add unique new events to old ones. """
    old_ids = [event['id'] for event in old_events]
    return old_events + [event for event in new_events if event['id'] not in old_ids]


def save_events(events):
    print 'About to save parsed events ...'
    _create_path_if_not_exists(DATA_PATH)
    path = os.path.join(DATA_PATH, FILE_NAME)
    with open(path, 'r') as f:
        old_events = json.load(f)
    events = _merge_events(old_events, events)
    with open(path, 'w') as f:
        json.dump(events, f)
    print '... Successfully saved parsed events.'

events = get_events()
save_events(events)
