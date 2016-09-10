""" Parses events from facebook graph API """
import requests


TOKEN = 'EAACEdEose0cBAPUGwEAAgCKZAIC7WeVulsMLxcxK6byHLZARr8DC5v93tphF5PgleVHSEndXGZAgSS7rPHl656iF9XP0ZBlu0lKc5CVGChu0ykxGhDCItHP5H1txPKaOS2u8xpzSomXmk9bPPKShSGGB5S0TMaK91qZAUuRdqeQZDZD'
LOCATIONS = ('kiev',)
TYPE = 'event'
URL = 'https://graph.facebook.com/search'

additional_params = {'debug': 'all', 'format': 'json', 'limit': 1000}

for location in LOCATIONS:
    params = {
        'q': location,
        'type': TYPE,
        'access_token': TOKEN,
    }
    params.update(additional_params)

    response = requests.get(URL, params=params)
    print response.json()
