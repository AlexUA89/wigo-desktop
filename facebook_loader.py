""" Parses events from facebook graph API """
import json
import os
import requests


# facebook token
TOKEN = 'EAACEdEose0cBAPUGwEAAgCKZAIC7WeVulsMLxcxK6byHLZARr8DC5v93tphF5PgleVHSEndXGZAgSS7rPHl656iF9XP0ZBlu0lKc5CVGChu0ykxGhDCItHP5H1txPKaOS2u8xpzSomXmk9bPPKShSGGB5S0TMaK91qZAUuRdqeQZDZD'
# parsed data folder (relative or absolute path)
DATA_PATH = os.path.join('data')
# parsed data file name
FILE_NAME = 'facebook.json'

URL = 'https://graph.facebook.com/search'
LOCATIONS = ('kiev',)
TYPE = 'event'
ADDITIONAL = {'debug': 'all', 'format': 'json', 'limit': 1000}


def get_events(request_count=5):
    events = []
    for location in LOCATIONS:
        params = {
            'q': location,
            'type': TYPE,
            'access_token': TOKEN,
        }
        params.update(ADDITIONAL)
        for _ in range(request_count):
            response = requests.get(URL, params=params).json()
            data = response['data']
            if not data:
                break
            events += data
            after = response['paging']['cursors']['after']
            params[after] = after

    return events


def _create_path_if_not_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)


def _merge_events(old_events, new_events):
    """ Add unique new events to old ones. """
    old_ids = [event['id'] for event in old_events]
    return old_events + [event for event in new_events if event['id'] not in old_ids]


def save_events(events):
    _create_path_if_not_exists(DATA_PATH)
    path = os.path.join(DATA_PATH, FILE_NAME)
    with open(path, 'r') as f:
        old_events = json.load(f)
    events = _merge_events(old_events, events)
    with open(path, 'w') as f:
        json.dump(events, f)

# events = get_events()
save_events([])
