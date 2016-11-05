import datetime
import json
import requests
import os
import time


START = datetime.datetime.now()
END = datetime.datetime.now() + datetime.timedelta(days=30)
QUERIES_COUNT = 25
# parsed data folder (relative or absolute path)
DATA_PATH = 'data'
# parsed data file name
FILE_NAME = 'bigcityevent.json'

HEADERS = [
    'Accept-Encoding:gzip, deflate, sdch',
    'Accept-Language:en-US,en;q=0.8',
    'Cache-Control:no-cache',
    'Connection:Upgrade',
    'Cookie:_gat=1; _ga=GA1.2.305305090.1477335222',
    'Pragma:no-cache',
    'Sec-WebSocket-Version:13',
]

# To get this URL go to http://bigcityevent.com/ and check ws request URL.
WS_URL = 'ws://bigcityevent.com/sockjs/123/dkxmfxmt/websocket'

PARSE_NEW_EVENTS = False
PARSE_DETAILS = True

# Facebook details:
FB_PREFIX = 'https://www.facebook.com/events/'
URL = 'https://graph.facebook.com/v2.7/'
FIELDS = ['name', 'description', 'id', 'place', 'end_time', 'start_time']
with open(os.path.join('tokens', 'facebook_token.txt'), 'r') as f:
    TOKEN = f.readline()


def _datetime_to_timestamp(dt):
    return int(time.mktime(dt.timetuple()))


def _timestamp_to_datetime(ts):
    return datetime.datetime.fromtimestamp(int(ts))


def _load(message):
    message = message.replace('\\"', '"').replace('\\\\"', '\\"').replace('"{', '{').replace('}"', '}')
    if message.startswith('a'):
        message = message[1:]
    return json.loads(message)


def _connect(ws):
    print '  connecting'
    ws.send(ws.send('["{\\"msg\\":\\"connect\\",\\"version\\":\\"1\\",\\"support\\":[\\"1\\",\\"pre2\\",\\"pre1\\"]}"]'))


def _query(ws, method):
    ws.queries_counter += 1
    if ws.queries_counter >= QUERIES_COUNT:
        return
    print '  quering'

    start = _datetime_to_timestamp(START)
    end = _datetime_to_timestamp(END)
    count_start = (ws.queries_counter - 1) * 36
    count_end = ws.queries_counter * 36
    ws.send(
        '["{\\"msg\\":\\"method\\",\\"method\\":\\"%s\\",'
        '\\"params\\":[{\\"dateFrom\\":%s,\\"dateTo\\":%s},{},%s,%s],\\"id\\":\\"%s\\"}"]'
        % (method, start, end, count_start, count_end, ws.queries_counter)
    )


def _save(events):
    path = os.path.join(DATA_PATH, FILE_NAME)
    if os.path.exists(path):
        with open(path, 'r') as f:
            try:
                exist_events = json.load(f)
            except ValueError:
                exist_events = {}
    else:
        exist_events = {}
    events = {e['_id']: e for e in events}
    exist_events.update(events)
    with open(path, 'w') as f:
        json.dump(exist_events, f)


def on_message(ws, message):
    print 'message received ..'
    print message[:1000] + '...'
    if message == 'o':
        _connect(ws)
        return
    message = _load(message)
    if 'msg' not in message[0]:
        print '  skipped'
        return
    if message[0]['msg'] == 'connected':
        _query(ws, 'loadMoreEvents')
        return
    if message[0]['msg'] == 'result':
        events = message[0]['result']
        _save(events)
        time.sleep(5)  # to avoid site overload and crash.
        _query(ws, 'loadMoreEvents')
        return


def on_error(ws, error):
    print 'error happened .. '
    print error


def on_close(ws):
    print "### closed ###"


def on_open(ws):
    print 'Opening Websocket connection to the server ... '


def get_valid_events():
    with open('data/bigcityevent.json', 'r') as f:
        events = json.load(f)
    return [e for e in events.values() if e['link'].startswith(FB_PREFIX) and e.get('place', {}).get('location')]


if __name__ == "__main__" and PARSE_NEW_EVENTS:
    import websocket
    websocket.enableTrace(True)
    # http://bigcityevent.com/sockjs/info?cb=gk53os5w6y
    ws = websocket.WebSocketApp(WS_URL,
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close,
                                header=HEADERS)
    ws.queries_counter = 0
    ws.run_forever()


if __name__ == "__main__" and PARSE_DETAILS:
    events = get_valid_events()
    params = {
        'access_token': TOKEN,
        'fields': ','.join(FIELDS),
    }
    detailed_events = []
    for event in events:
        url = URL + event['link'][len(FB_PREFIX):]
        print 'Getting data from url', url
        response = requests.get(url, params=params)
        detailed_event = response.json()
        detailed_event['tags'] = [event.get('tag')]
        detailed_events.append(detailed_event)

    with open('data/bigcityevent_full.json', 'w') as f:
        json.dump(detailed_events, f)
