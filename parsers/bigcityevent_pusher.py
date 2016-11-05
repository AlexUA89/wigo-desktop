import datetime
import json
import pprint

pp = pprint.PrettyPrinter()


# def _load(message):
#     message = message.replace('\\"', '"').replace('\\\\"', '\\"').replace('"{', '{').replace('}"', '}')
#     if message.startswith('a'):
#         message = message[1:]
#     return json.loads(message)


# f = open('data/bigcityevents-test.txt')
# message = f.readline()
# f.close()
# message = _load(message)

# print message[0]['msg']
# result = message[0]['result']
# events = result['events']

# event = events[3]
# pp.pprint(event)
# # print len(events), '/', len([e for e in events if e.get('place', {}).get('location')])

# print datetime.datetime.fromtimestamp(1477612800)
# print datetime.datetime.fromtimestamp(1476721318)

f = open('data/bigcityevent.json')
events = json.load(f)
f.close()
events = events.values()

print len(events)
print len([e for e in events if e.get('tag')])
print len([e for e in events if e['source'] == 'fb' and e.get('place', {}).get('location')])
print len([e for e in events if e['source'] == 'fb' and e.get('place', {}).get('location') and e.get('tag')])

event = next(e for e in events if e['link'] == 'https://www.facebook.com/events/217898498628448')
pp.pprint(event)

# for event in events.values()[:20]:
#     pp.pprint(event)
