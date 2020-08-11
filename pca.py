import pandas as pd
from matplotlib import pyplot as plt
from sklearn import manifold
import numpy as np



def action():
    data = pd.io.parsers.read_csv('static/dataset.csv',
         delimiter=',',
         header=0,
        );

    from sklearn.preprocessing import StandardScaler
    features = ['n_tokens_content','num_hrefs','num_imgs','num_videos','argument','day']

    # Separating out the features
    x = data.loc[:, features].values
    # Separating out the target
    y = data.loc[:,['successful']].values
    # Standardizing the features
    x = StandardScaler().fit_transform(x)

    from sklearn.decomposition import PCA
    pca = PCA(n_components=6)

    principalComponents = pca.fit_transform(x)

    principalDf = pd.DataFrame(data = principalComponents, columns = ['X1', 'X2', 'X3', 'X4', 'X5', 'X6'])
    midDf=pd.concat([principalDf, data[["url"]]], axis=1)
    list_of_attributes=['n_tokens_content','num_hrefs','num_imgs','num_videos','argument','day','numWords','numMedia','shares']
    for elem in list_of_attributes:
        midDf=pd.concat([midDf, data[[elem]]], axis=1)
    finalDf = pd.concat([midDf, data[['successful']]], axis = 1)
    finalDf=finalDf.rename(index=str, columns={"successful": "target"})
    finalDf.to_csv("static/pca.csv", sep=',', index=False)
    return 0;

if __name__ == "__main__":
    action()
