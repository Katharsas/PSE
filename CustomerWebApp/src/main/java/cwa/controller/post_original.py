"""
   #https://gateway.watsonplatform.net/relationship-extraction-beta/api
 "password": "3DpQXZVtT4Gn",
        "username": "5611f2c7-5c56-48e6-8c29-67bfd7dc7aa6"



https://github.com/watson-developer-cloud/python-sdk/blob/f724f12bd70ddf49ffb52c7ba817bc7a0c9f312d/watson_developer_cloud/relationship_extraction_v1_beta.py



"""

import requests
import json

def main():
   default_url = "https://gateway.watsonplatform.net/relationship-extraction-beta/api"
   
   password="3DpQXZVtT4Gn"
   username="5611f2c7-5c56-48e6-8c29-67bfd7dc7aa6"
   
   headers = { 'content-type': 'application/json',
               'Accept': 'application/json', #passt hier in header
             }
   auth=(username, password)
   
   dataset = 'ie-en-news'
   return_type = "json"
   text = "hasn was going there new york"
   text = "Nowhere is this more evident than in the new FirePro card AMD is announcing today in New York, with James Bond."
   text = open("google.txt","r").read()
   params = {'txt': text, 'rt': return_type, 'sid': dataset}

   is_json = (return_type == 'json')

   r = requests.request(method='POST', url=default_url+'/v1/sire/0', data=params, auth=auth)
   #i
        
        
   #  method='GET', url=default_url+'/v1/synthesize', params=params,stream=True,
   #  auth=auth)
   # bug GET hat nur 6KB , POST  kann 5KB daten ??
   print r
   #print r.text
   print r.status_code
   if r.status_code != 200:
     print str(r)
     raise Exception("Error calling the service.")
   fname = "text_0"
   a = json.dumps(r.json(), indent=3)  
   open("json_"+fname+".txt", "w").write(a)
   
   #print r.json()
   #print r.content #bug
   #print r.text# bug?
   import read_json as rj
   rj.main()
   
   
main()




