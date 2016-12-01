import datetime
import json
import requests
import os
import time
import websocket

# parsed data folder (relative or absolute path)
DATA_PATH = 'data'
TOKENS_PATH = 'tokens'


def datetime_to_timestamp(dt):
    return int(time.mktime(dt.timetuple()))


def timestamp_to_datetime(ts):
    return datetime.datetime.fromtimestamp(int(ts))


def get_json_file_data(file_path):
    """ Loads data from file if it exist, returns None if file is empty or unprasable """
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r') as f:
        try:
            return json.load(f)
        except ValueError:
            return


def save_events(events, file_name):
    path = os.path.join(DATA_PATH, file_name)
    print '### Saving events to file %s ###' % path
    with open(path, 'w') as f:
        json.dump(events, f)


websocket.enableTrace(True)


class BCELoader(object):
    """ Loads events from bigcityevents.com using websockets. """

    # To get this URL go to http://bigcityevent.com/ and check ws request URL.
    WS_URL = 'ws://bigcityevent.com/sockjs/568/61xhvkn5/websocket'
    FILE_NAME = 'bce_events.json'
    HEADERS = [
        'Accept-Encoding:gzip, deflate, sdch',
        'Accept-Language:en-US,en;q=0.8',
        'Cache-Control:no-cache',
        'Connection:Upgrade',
        'Cookie:_gat=1; _ga=GA1.2.305305090.1477335222',
        'Pragma:no-cache',
        'Sec-WebSocket-Version:13',
    ]
    START = datetime.datetime.now()
    END = datetime.datetime.now() + datetime.timedelta(days=30)
    EVENTS_IN_QUERY = 3000
    MAX_QUERIES_COUNT = 1

    def __init__(self):
        self.queries_count = 0
        self.events = []

    def load(self):
        ws = self._init_ws()
        ws.run_forever()

    def _init_ws(self):
        def on_message(ws, message):
            print '\nmessage received ..'
            print message[:1000] + '...'
            if message == 'o':
                self._connect(ws)
                return
            message = self._load_message(message)
            if 'msg' not in message[0]:
                print '.. skipped'
                return
            if message[0]['msg'] == 'connected':
                self._query(ws, 'loadMoreEvents')
                return
            if message[0]['msg'] == 'result':
                print '.. got events'
                events = message[0]['result']
                print len(message[0]['result'])
                if not events:
                    ws.close()
                self.events += events
                time.sleep(3)  # to avoid site overload and crash.
                self._query(ws, 'loadMoreEvents')
                if self.queries_count >= self.MAX_QUERIES_COUNT:
                    ws.close()
                return

        def on_error(ws, error):
            print 'error happened .. '
            print error

        def on_close(ws):
            print '### ws connection closed ###'

        def on_open(ws):
            print '### ws connection opened ###'

        return websocket.WebSocketApp(
            self.WS_URL,
            on_open=on_open,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close,
            header=self.HEADERS)

    def _load_message(self, message):
        message = message.replace('\\"', '"').replace('\\\\"', '\\"').replace('"{', '{').replace('}"', '}')
        if message.startswith('a'):
            message = message[1:]
        return json.loads(message)

    def _connect(self, ws):
        print '.. connecting'
        ws.send('["{\\"msg\\":\\"connect\\",\\"version\\":\\"1\\",\\"support\\":[\\"1\\",\\"pre2\\",\\"pre1\\"]}"]')

    def _query(self, ws, method):
        print '.. quering'
        self.queries_count += 1
        start = datetime_to_timestamp(self.START)
        end = datetime_to_timestamp(self.END)
        count_start = (self.queries_count - 1) * self.EVENTS_IN_QUERY
        count_end = self.queries_count * self.EVENTS_IN_QUERY
        print count_start, count_end
        ws.send(
            '["{\\"msg\\":\\"method\\",\\"method\\":\\"%s\\",'
            '\\"params\\":[{\\"dateFrom\\":%s,\\"dateTo\\":%s},{},%s,%s],\\"id\\":\\"%s\\"}"]'
            % (method, start, end, count_start, count_end, self.queries_count)
        )


class FBLoader(object):
    """ Loads events additional details from facebook based """
    FB_PREFIX = 'https://www.facebook.com/events/'
    URL = 'https://graph.facebook.com/v2.7/'
    FIELDS = ['name', 'description', 'id', 'place', 'end_time', 'start_time']
    TOKEN_FILE = 'facebook_token.txt'
    FILE_NAME = 'fb_events.json'

    def __init__(self, bce_events):
        self.bce_events = bce_events
        with open(os.path.join(TOKENS_PATH, self.TOKEN_FILE), 'r') as f:
            self.token = f.readline()

    def load(self):
        self.events = []
        valid_bce_events = [e for e in bce_events if self._is_valid(e)]
        for index, bce_event in enumerate(valid_bce_events):
            print 'Event %s from %s' % (index, len(valid_bce_events))
            event = self._load_from_facebook(bce_event)
            if event:
                event['tags'] = [bce_event.get('tag')]
                event['url'] = bce_event['link']
                self.events.append(event)

    def _is_valid(self, bce_event):
        return bce_event['link'].startswith(self.FB_PREFIX) and bce_event.get('place', {}).get('location')

    def _load_from_facebook(self, bce_event):
        params = {
            'access_token': self.token,
            'fields': ','.join(self.FIELDS),
        }
        url = self.URL + bce_event['link'][len(self.FB_PREFIX):]
        print 'Getting Facebook data from url', url
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print '  Fail'
            print '  %s' % response.json()


if __name__ == "__main__":
    # STEP 1: Load events from bigcityevents.com
    # bce_loader = BCELoader()
    # bce_loader.load()
    # save_events(bce_loader.events, bce_loader.FILE_NAME)

    # STEP 2: Update events data based on facebook.
    path = os.path.join(DATA_PATH, BCELoader.FILE_NAME)
    with open(path, 'r') as f:
        bce_events = json.load(f)
    fb_loader = FBLoader(bce_events)
    fb_loader.load()
    save_events(fb_loader.events, fb_loader.FILE_NAME)
