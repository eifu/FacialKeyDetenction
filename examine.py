import os

import numpy as np
from pandas.io.parsers import read_csv



fname = './training.csv'
df = read_csv(os.path.expanduser(fname))  # data frame
df = df.dropna()
image_series = df["Image"].apply(lambda im: np.fromstring(im, dtype=np.int64, sep=" "))


def convertXYColumns(x_list, y_list):
    result = np.zeros(2140)
    for i, x_elem in enumerate(x_list):
            result[i] = x_elem + y_list[i]*96 # the image is 96 by 96
    return result


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
                       mouth_center_top_lip, mouth_center_bottom_lip])
data_array = data_array.T



from sklearn.cluster import KMeans

cluster_value = KMeans(n_clusters=4).fit_predict(data_array)

save_array = np.array([left_eye_center, right_eye_center, 
                       left_eye_inner_corner, left_eye_outer_corner, 
                       right_eye_inner_corner, right_eye_outer_corner, 
                       left_eyebrow_inner_end, left_eyebrow_outer_end, 
                       right_eyebrow_inner_end, right_eyebrow_outer_end, 
                       nose_tip, mouth_left_corner, mouth_right_corner, 
                       mouth_center_top_lip, mouth_center_bottom_lip, 
                       image_series, cluster_value])


data_array = data_array.T
import csv
header = ["left_eye_center", "right_eye_center", 
          "left_eye_inner_corner", "left_eye_outer_corner", 
          "right_eye_inner_corner", "right_eye_outer_corner", 
          "left_eyebrow_inner_end", "left_eyebrow_outer_end", 
          "right_eyebrow_inner_end", "right_eyebrow_outer_end", 
          "nose_tip", "mouth_left_corner", "mouth_right_corner", 
          "mouth_center_top_lip", "mouth_center_bottom_lip", "Image", "cluster_id"]
f = open('test.csv', 'w')

writer = csv.writer(f, lineterminator='\n')
writer.writerow(header)
writer.writerows(data_array)
f.close()