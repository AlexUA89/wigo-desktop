""" Parses events from facebook graph API """
import requests


TOKEN = 'EAACEdEose0cBAPUGwEAAgCKZAIC7WeVulsMLxcxK6byHLZARr8DC5v93tphF5PgleVHSEndXGZAgSS7rPHl656iF9XP0ZBlu0lKc5CVGChu0ykxGhDCItHP5H1txPKaOS2u8xpzSomXmk9bPPKShSGGB5S0TMaK91qZAUuRdqeQZDZD'

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
