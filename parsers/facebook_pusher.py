# coding: utf-8
""" Pushes events to the server. """
import json
import os
import requests

# parsed data folder (relative or absolute path)
DATA_PATH = os.path.join('data')
# parsed data file name
# FILE_NAME = 'facebook.json'
FILE_NAME = 'fb_events.json'
CACHE_FILE_NAME = '~facebook_pushed_events.json'
# WIGO domain
DOMAIN = 'http://54.208.250.42:8080/wigo-server/'
# WIGO status URL
STATUS_URL = 'api/status'
# WIGO token
with open(os.path.join('tokens', 'wigo_token.txt'), 'r') as f:
    TOKEN = f.readline()
# WIGO user_id
with open(os.path.join('tokens', 'wigo_token.txt'), 'r') as f:
    USER_ID = f.readline()

DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ3aWdvLmNvbSIsInN1'
                     'YiI6ImY5MDg4NTRiLTkzZjUtNDhiYy05MjEzLTdhYmNiMTE2OWQ0OCIsI'
                     'mlhdCI6MTQ4MDE1NTcxMiwiZXhwIjoxNDgyNzQ3NzEyfQ.jNOvWbdjzzE'
                     '2uNcTDR0j4rLLrgH0OIhMtwRIkId5LiO_aoEIstNncaoUJtQCALQFSqT5'
                     'piSUpBjB05-Vt0I13w',
}

with open(os.path.join(DATA_PATH, FILE_NAME), 'r') as f:
    events = json.load(f)

try:
    with open(os.path.join(DATA_PATH, CACHE_FILE_NAME), 'r') as f:
        pushed_events_ids = json.load(f)
except IOError:
    pushed_events_ids = []


def _format_time(time):
    """ 2016-10-08T15:00:00+0300 -> 2016-10-08T15:00:00.000Z """
    return time.split('+')[0] + '.000Z'


def push_event(event):
    """ Push event to WIGO server. """
    print 'About to push event "%s"' % event['id']
    if 'location' not in event.get('place', {}):
        print 'Location is not specified for event "%s".' % str(event['id'])
        return
    latitude = event['place']['location']['latitude']
    longitude = event['place']['location']['longitude']
    if latitude < 45 or latitude > 55 or longitude < 25 or longitude > 35:
        print latitude, longitude
        print 'Event "%s" is skipped, because its location is not in Kiev.' % str(event['id'])
        return
    url = DOMAIN + STATUS_URL
    data = {
        "latitude": event['place']['location']['latitude'],
        "longitude": event['place']['location']['longitude'],
        "name": event['name'],
        "startDate": _format_time(event['start_time']),
        "endDate": _format_time(event.get('end_time') or event['start_time']),
        "text": event.get('description', ''),
        "kind": "event",
        "userId": USER_ID,
        "url": event['url'],
    }
    print USER_ID
    if event.get('tags') and event.get('tags')[0]:
        data['hashtags'] = event.get('tags')
    response = requests.post(url, data=json.dumps(data), headers=DEFAULT_HEADERS)
    if response.status_code != 200:
        raise Exception('Failed to push data: %s, response data: %s' % (data, response))
    print response.json()
    print 'Event "%s" has been pushed to server.' % str(event['id'])
    print '--------' * 20


def read_unicode(text, charset='utf-8'):
    if isinstance(text, basestring):
        if not isinstance(text, unicode):
            text = unicode(text, charset)
    return text


for event in events:
    if not event.get('id'):
        print 'ERROR! Event without ID.', event
        continue
    push_event(event)
    pushed_events_ids.append(event['id'])


with open(os.path.join(DATA_PATH, CACHE_FILE_NAME), 'w') as f:
    json.dump(pushed_events_ids, f)
