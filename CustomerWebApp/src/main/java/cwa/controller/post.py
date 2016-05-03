"""
   #https://gateway.watsonplatform.net/relationship-extraction-beta/api
 "password": "3DpQXZVtT4Gn",
        "username": "5611f2c7-5c56-48e6-8c29-67bfd7dc7aa6"



https://github.com/watson-developer-cloud/python-sdk/blob/f724f12bd70ddf49ffb52c7ba817bc7a0c9f312d/watson_developer_cloud/relationship_extraction_v1_beta.py



"""

import requests
import json

def main():
   default_url = "http://localhost:8080/CWA"
   
   headers = { 'content-type': 'application/json',
               'Accept': 'application/json', #passt hier in header
             }
   

   params = {'txt': "text_json"}
   params = json.dumps(params);
   #params = '{"action":"search_by_keyword","words":"twitter barack obama"}';

   #is_json = (return_type == 'json')

   r = requests.request(method='POST', url=default_url+'/post', data=params)
   
   print r
   #print r.text
   print r.status_code
   if r.status_code != 200:
     print str(r)
     raise Exception("Error calling the service.")
     
   fname = "text_0"
   #a = json.dumps(r.json(), indent=3)  
   #open("json_"+fname+".txt", "w").write(a)
   
   print r.content 
   print r.text
   
   print r.json()
   obj = r.json()
   print obj["txt"]
   #print r.content #bug
   #print r.text# bug?
   
   ##import read_json as rj
   ##rj.main()
   
   
main()




