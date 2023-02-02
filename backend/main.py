from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
import requests
import uuid
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="text_to_speech"
)

cursor = db.cursor(dictionary=True)

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

def hasLink(link):
    sql = "SELECT id FROM links WHERE link = %s"
    cursor.execute(sql, (link,))
    data = cursor.fetchone()
    if data:
        return True
    else:
        return False

@app.route('/api/link', methods=['GET'])
@cross_origin()
def getLinks():
    sql = "SELECT * FROM links"
    cursor.execute(sql)
    result = cursor.fetchall()
    return make_response(jsonify(result), 200)

@app.route('/api/link', methods=['POST'])
@cross_origin()
def addLink():
        if hasLink(request.json['link']):
            return make_response(jsonify({'type':False, 'message': 'Link already exists!'}), 409)

        elif not request.json['link']:
            return make_response(jsonify({'type':False, 'message': 'Enter a link!'}),422)

        elif 'http://' not in request.json['link'] and 'https://' not in request.json['link'] and 'www.' not in request.json['link']:
            return make_response(jsonify({'type':False, 'message': 'Enter a valid link!'}), 422)

        else:
                newlink = request.json['link']
                response = requests.get(newlink)
                soup = BeautifulSoup(response.content, "html.parser")
                sql = "INSERT INTO links (id, link, text) VALUES (%s, %s, %s)"
                cursor.execute(sql, (str(uuid.uuid4()), newlink, soup.getText()))
                db.commit()
               
                return make_response(jsonify({'type':True, 'message': 'Link added successfully!'}), 201)
        
if __name__ == '__main__':
    app.run(debug=True, port=5000)
