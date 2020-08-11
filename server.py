from flask import Flask, render_template, send_from_directory, request
import numpy as np
import pandas as pd
from sklearn import preprocessing
import math
import sys
from operator import itemgetter

import frequency
import instances
import pca
import dsprocessing

app = Flask(__name__, static_folder='/static')


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('static', path)


@app.route('/new_instance', methods=['POST'])
def new_instance():
    f = open("static/dataset.csv", "a")
    new = {}
    for key, value in request.form.items():
        new[key] = value  # Add inside the dictionary the data from the form

    nw = ""
    if float(new["n_tokens_content"]) < 500:
        nw += '1'
    if float(new["n_tokens_content"]) >= 500 and float(new["n_tokens_content"]) < 1000:
        nw += '2'
    if float(new["n_tokens_content"]) >= 1000 and float(new["n_tokens_content"]) < 1500:
        nw += '3'
    if float(new["n_tokens_content"]) >= 1500:
        nw += '4'
    nm = ""
    if float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) < 20:
        nm += '1'
    if float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) >= 20 and float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) < 40:
        nm += '2'
    if float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) >= 40 and float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) < 60:
        nm += '3'
    if float(new["num_hrefs"])+float(new["num_imgs"])+float(new["num_videos"]) >= 60:
        nm += '4'

    line = new["url"]+","+new["n_tokens_content"]+","+new["num_hrefs"]+","+new["num_imgs"] + \
        ","+new["num_videos"]+","+new["argument"] + \
        ","+new["day"]+","+nw+","+nm+","
    temp = np.array([new["n_tokens_content"], new["num_hrefs"],
                     new["num_imgs"], new["num_videos"], new["argument"], new["day"]])
    features = ['url', 'n_tokens_content', 'num_hrefs',
                'num_imgs', 'num_videos', 'argument', 'day', 'shares']
    data_df = pd.read_csv("static/dataset.csv", delimiter=',', header=0)
    x = np.array(data_df[features].values)
    dists = {}
    for item in x:
        #print(item[0])
        if int(new['argument']) == int(item[5]) and int(new['day']) == int(item[6]):
            dists[item[0]] = abs(float(new["n_tokens_content"]) - item[1]) + abs(float(new['num_hrefs']) - item[2]) + abs(float(new['num_imgs']) -
                                                                                                                          item[3]) + abs(float(new['num_videos']) - item[4]) + abs(float(new['argument']) - item[5]) + abs(float(new['day']) - item[6])
    dists = sorted(dists.items(), key=itemgetter(1))
    vec = []
    for elem in dists[0:10]:
        for i in x:
            if i[0] in elem:
                vec.append(i)
    count = 0
    i = 0
    for elem in vec:
        i = i+1
        count += elem[7]
    count = count / i
    line += str(int(count))+","
    if int(count) > 3395:
        line += "1\n"
    else:
        line += "0\n"
    f.write(line)
    f.close()
    pca.action()
    frequency.action()
    instances.action()
    return "Added a new Article with url: "+new['url']+"\nExpected number of shares: " + str(int(count))



if __name__ == "__main__":
    dsprocessing.action()
    pca.action()
    frequency.action()
    instances.action()
    app.jinja_env.auto_reload = True
    app.run(debug=True)
