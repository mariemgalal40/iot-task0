from firebase import firebase
from time import sleep as s
# import json
import json

firebase = firebase.FirebaseApplication("https://esp-database-1248a-default-rtdb.firebaseio.com/", None)

with open('json_data_humidity.json', 'w') as outfile:
    outfile.write('0')

with open('json_data_temperature.json', 'w') as outfile:
    outfile.write('0')

while True:
    try:
        humidity = firebase.get('/READINDS/humidity/', None)
        temperature = firebase.get('/READINDS/temperature/', None)

        temperature1 = []
        for value in temperature.values():
            temperature1.append(value)

        humidity1 = []
        for value in humidity.values():
            humidity1.append(value)

        # jsonString1 = json.dumps(temperature1)
        # jsonString2 = json.dumps(humidity1)
        last_reading_temperature = temperature1.pop()
        last_reading_humidity = humidity1.pop()
        print(last_reading_humidity)
        print(last_reading_temperature)

        # json_object["d"] = last_reading_humidity
        a_file = open("json_data_humidity.json", "w")
        json.dump(last_reading_humidity, a_file)
        a_file.close()

        a_file = open("json_data_temperature.json", "w")
        json.dump(last_reading_temperature, a_file)
        a_file.close()
        # jsonStringHumidity = json.dumps(last_reading_humidity)
        # jsonStringTemperature = json.dumps(last_reading_temperature)
        # Using a JSON string


            # with open("humidity.txt", "w") as output:
        #     output.write(str(humidity1))

        # with open("temperature1.txt", "w") as output:
        #     output.write(str(temperature1))

        # with open("last_reading_humidity.txt", "w") as output:
        #     output.write(str(last_reading_humidity))

        # with open("last_reading_temperature.txt", "w") as output:
        #     output.write(str(last_reading_temperature))
        s(3)
    except:
        pass