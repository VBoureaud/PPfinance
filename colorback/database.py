import pymongo
import base64
import json
import datetime
from config import config

dbName = config['dbName']
collectionName = "pixels"

## DB CONNECT
CONNECTION_STRING = "mongodb+srv://" + config['dbUser'] + ":" + config['dbPwd'] + "@" + config['dbCluster'] + dbName + "?retryWrites=true&w=majority"
if (config['dev']):
	CONNECTION_STRING = "mongodb://localhost:27017/" + dbName
myclient = pymongo.MongoClient(CONNECTION_STRING)
mydb = myclient[dbName]
mycol = mydb[collectionName]

def getFirst():
	dataDB = getAll()
	return json.loads(dataDB[0]['pixels']) if len(dataDB) else None

def getOne(query):
	return mycol.find_one(query)

def getAll(params=None):
	data = []
	res = col.find(params) if params is not None else mycol.find()
	for x in res:
		#del x['_id']
		data.append(x)
	return data

def addOne(data):
	x = mycol.insert_one(data)
	return x.inserted_id

def updateOne(query, data):
	newvalues = { "$set": data }
	mycol.update_one(query, newvalues)
	return True

def deleteOne(query):
	return mycol.delete_one(query)

def dbCreateAndSave(data):
	return addOne(data)

# Save in first position
def dbSaveData(data):
	#print(data)
	now = datetime.datetime.now()
	print(str(now) + ': save new pixels')
	dataDB = getAll()
	if (len(dataDB) == 0):
		return dbCreateAndSave(data)
	else:
		mid = dataDB[0]['_id']
		updateOne({ '_id': mid }, data)
		return mid