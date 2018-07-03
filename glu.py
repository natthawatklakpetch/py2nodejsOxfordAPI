import requests
import json
import sys

values = []
for v in sys.argv:
    try:
        values.append(v)
    except:
        pass

app_id = '76fe7e76'
app_key = 'c307519ca3eef8e4e69998b17073bf30'

language = 'en'
word_id = values[1]

url = 'https://od-api.oxforddictionaries.com:443/api/v1/inflections/' + language + '/' + word_id.lower()

r = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})

# print("code {}\n".format(r.status_code))
# print("text \n" + r.text)
try:
    output = r.json()
    print("true")
except ValueError:
    print("false")
