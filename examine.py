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

cluster_value = KMeans(n_clusters=10).fit_predict(data_array)

prepared_data = np.zeros((15, 10))
count_data = np.zeros((15,10))

for label_index in range(15):
    
    min_in_array = np.min(data_array[label_index])
    diff = (np.max(data_array[label_index])-min_in_array)/10
    
    for diff_index in range(10):
        
        prepared_data[label_index][diff_index] = min_in_array + diff*diff_index
        count = 0
        for elem in data_array[label_index]: 
            if min_in_array+(diff*diff_index) <= elem < min_in_array + (diff*(diff_index+1)):
                count += 1
                
        count_data[label_index][diff_index] = count

prepared_data = prepared_data.T
count_data = count_data.T


header = ["left_eye_center", "right_eye_center", 
          "left_eye_inner_corner", "left_eye_outer_corner", 
          "right_eye_inner_corner", "right_eye_outer_corner", 
          "left_eyebrow_inner_end", "left_eyebrow_outer_end", 
          "right_eyebrow_inner_end", "right_eyebrow_outer_end", 
          "nose_tip", "mouth_left_corner", "mouth_right_corner", 
          "mouth_center_top_lip", "mouth_center_bottom_lip"]

import csv
f = open('equi_width_data.csv', 'w')

writer = csv.writer(f, lineterminator='\n')
writer.writerow(header)
writer.writerows(prepared_data)
f.close()


f = open('count_data.csv', 'w')

writer = csv.writer(f, lineterminator='\n')
writer.writerow(header)
writer.writerows(count_data)
f.close()