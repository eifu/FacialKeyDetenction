import os

import numpy as np
from pandas.io.parsers import read_csv



fname = './training.csv'
df = read_csv(os.path.expanduser(fname))  # data frame
df = df.dropna()
image_series = df["Image"].apply(lambda im: np.fromstring(im, dtype=np.int64, sep=" "))



left_eye_center = convertXYColumns(df["left_eye_center_x"].tolist(),df["left_eye_center_y"].tolist())
right_eye_center = convertXYColumns(df["right_eye_center_x"].tolist(),df["right_eye_center_y"].tolist())
left_eye_inner_corner  = convertXYColumns(df["left_eye_inner_corner_x"].tolist(),df["left_eye_inner_corner_y"].tolist())
left_eye_outer_corner = convertXYColumns(df["left_eye_outer_corner_x"].tolist(),df["left_eye_outer_corner_y"].tolist())
right_eye_inner_corner = convertXYColumns(df["right_eye_inner_corner_x"].tolist(),df["right_eye_inner_corner_y"].tolist())
right_eye_outer_corner = convertXYColumns(df["right_eye_outer_corner_x"].tolist(),df["right_eye_outer_corner_y"].tolist())
left_eyebrow_inner_end = convertXYColumns(df["left_eyebrow_inner_end_x"].tolist(),df["left_eyebrow_inner_end_y"].tolist())
left_eyebrow_outer_end = convertXYColumns(df["left_eyebrow_outer_end_x"].tolist(),df["left_eyebrow_outer_end_y"].tolist())
right_eyebrow_inner_end = convertXYColumns(df["right_eyebrow_inner_end_x"].tolist(),df["right_eyebrow_inner_end_y"].tolist())
right_eyebrow_outer_end = convertXYColumns(df["right_eyebrow_outer_end_x"].tolist(),df["right_eyebrow_outer_end_y"].tolist())
nose_tip = convertXYColumns(df["nose_tip_x"].tolist(),df["nose_tip_y"].tolist())
mouth_left_corner = convertXYColumns(df["mouth_left_corner_x"].tolist(),df["mouth_left_corner_y"].tolist())
mouth_right_corner = convertXYColumns(df["mouth_right_corner_x"].tolist(),df["mouth_right_corner_y"].tolist())
mouth_center_top_lip = convertXYColumns(df["mouth_center_top_lip_x"].tolist(),df["mouth_center_top_lip_y"].tolist())
mouth_center_bottom_lip = convertXYColumns(df["mouth_center_bottom_lip_x"].tolist(),df["mouth_center_bottom_lip_y"].tolist())


data_array = np.array([left_eye_center, right_eye_center, 
                       left_eye_inner_corner, left_eye_outer_corner, 
                       right_eye_inner_corner, right_eye_outer_corner, 
                       left_eyebrow_inner_end, left_eyebrow_outer_end, 
                       right_eyebrow_inner_end, right_eyebrow_outer_end, 
                       nose_tip, mouth_left_corner, mouth_right_corner, 
                       mouth_center_top_lip, mouth_center_bottom_lip, image_series])
data_array = data_array.T



from sklearn.cluster import KMeans

cluster_value = KMeans(n_clusters=4).fit_predict(data_array)

clusterinfo = pd.DataFrame()
clusterinfo["left_eye_center"]=left_eye_center
clusterinfo["right_eye_center"]= right_eye_center
clusterinfo["left_eye_inner_corner"]=left_eye_inner_corner
clusterinfo["left_eye_outer_corner"]=left_eye_outer_corner 
clusterinfo["right_eye_inner_corner"]=right_eye_inner_corner
clusterinfo["right_eye_outer_corner"]=right_eye_outer_corner
clusterinfo["left_eyebrow_inner_end"]=left_eyebrow_inner_end
clusterinfo["left_eyebrow_outer_end"]=left_eyebrow_outer_end 
clusterinfo["right_eyebrow_inner_end"]=right_eyebrow_inner_end
clusterinfo["right_eyebrow_outer_end"]=right_eyebrow_outer_end
clusterinfo["nose_tip"]=nose_tip
clusterinfo["mouth_left_corner"]=mouth_left_corner
clusterinfo["mouth_right_corner"]=mouth_right_corner
clusterinfo["mouth_center_top_lip"]=mouth_center_top_lip
clusterinfo["mouth_center_bottom_lip"]=mouth_center_bottom_lip
clusterinfo["Image"] = image_series
clusterinfo["cluster_id"]=cluster_value

clusterinfo.to_csv("test.csv", header=header)