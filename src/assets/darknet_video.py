from ctypes import *
from util import *
from GameState import *
import math
import random
import os
import cv2
import numpy as np
import time
import darknet

def cvDrawBoxes(bestpt1, bestpt2, img):
	cv2.rectangle(img, bestpt1, bestpt2, (0, 255, 0), 1)
	return img


netMain = None
metaMain = None
altNames = None

player1Name = ""
player2Name = ""
gameScore = 0

tableBoundariesSet= []

# mouse callback function
def draw_boundary(event,x,y,flags,param):
	if event == cv2.EVENT_LBUTTONDBLCLK:
		if len(tableBoundariesSet) !=6:
			tableBoundariesSet.append((x,y))
			# print(tableBoundariesSet)

def YOLO():

	global metaMain, netMain, altNames
	configPath = "yolov3-tiny.cfg"
	weightPath = "420.weights"
	metaPath = "obj.data"
	if not os.path.exists(configPath):
		raise ValueError("Invalid config path `" +
						 os.path.abspath(configPath)+"`")
	if not os.path.exists(weightPath):
		raise ValueError("Invalid weight path `" +
						 os.path.abspath(weightPath)+"`")
	if not os.path.exists(metaPath):
		raise ValueError("Invalid data file path `" +
						 os.path.abspath(metaPath)+"`")
	if netMain is None:
		netMain = darknet.load_net_custom(configPath.encode(
			"ascii"), weightPath.encode("ascii"), 0, 1)  # batch size = 1
	if metaMain is None:
		metaMain = darknet.load_meta(metaPath.encode("ascii"))
	if altNames is None:
		try:
			with open(metaPath) as metaFH:
				metaContents = metaFH.read()
				import re
				match = re.search("names *= *(.*)$", metaContents,
								  re.IGNORECASE | re.MULTILINE)
				if match:
					result = match.group(1)
				else:
					result = None
				try:
					if os.path.exists(result):
						with open(result) as namesFH:
							namesList = namesFH.read().strip().split("\n")
							altNames = [x.strip() for x in namesList]
				except TypeError:
					pass
		except Exception:
			pass

	cap = cv2.VideoCapture(0)
	cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
	cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
	cap.set(cv2.CAP_PROP_SETTINGS, 1)
	cv2.namedWindow('Demo')
	cv2.setMouseCallback('Demo',draw_boundary)
	out = cv2.VideoWriter("output.avi", cv2.VideoWriter_fourcc(*"MJPG"), 10.0, (darknet.network_width(netMain), darknet.network_height(netMain)))
	print("Starting the YOLO loop...")

	# Create an image we reuse for each detect
	darknet_image = darknet.make_image(darknet.network_width(netMain),
									darknet.network_height(netMain),3)



	# setup initial boundaries
	ret, frame_read = cap.read()
	frame_resized = cv2.resize(frame_read,
						   (darknet.network_width(netMain),
							darknet.network_height(netMain)),
						   interpolation=cv2.INTER_LINEAR)
	cv2.imshow('Demo', frame_resized)
	while len(tableBoundariesSet) != 6:
		cv2.waitKey(1)

	state =  GameState()

	while True:
		prev_time = time.time()
		ret, frame_read = cap.read()
		frame_rgb = cv2.cvtColor(frame_read, cv2.COLOR_BGR2RGB)
		frame_resized = cv2.resize(frame_rgb,
								   (darknet.network_width(netMain),
									darknet.network_height(netMain)),
								   interpolation=cv2.INTER_LINEAR)

		darknet.copy_image_from_bytes(darknet_image,frame_resized.tobytes())

		detections = darknet.detect_image(netMain, metaMain, darknet_image, thresh=0.75)
		bestpt1, bestpt2 = detectionHandler(detections, frame_resized)

		ballLocation = getCenterPoint(bestpt1[0], bestpt1[1], bestpt2[0], bestpt2[1])


		image = cvDrawBoxes(bestpt1, bestpt2, frame_resized)
		image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
		if isBallOnTable(ballLocation) and collisionDetection(ballLocation, image):
			state.addBounce()
			print("added a bounce")
		# if isBallOnTable(ballLocation):
		# 	addBallLocation(ballLocation, image)

		#get ball side
		tableSide = getTableSide(ballLocation)
		if tableSide != "":
			# if state.side != tableSide:
			# 	#it changed side
			# 	didBounce = colDetection2()
			# 	if didBounce:
			# 		print("it bounced")
			# 	else:
			# 		print("no bounce detected")
			# 	resetLocations()
			state.updateSide(tableSide)

		scoreP1, scoreP2 = state.tick()

		#draw ball side
		tableBoundaryHandler(image, tableBoundariesSet)
		if tableSide == "left":
			cv2.putText(image, tableSide, (200, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255))
		else:
			cv2.putText(image, tableSide, (375, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255))


		cv2.putText(image, "P1: " + str(scoreP1), (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255))
		cv2.putText(image, "P2: " + str(scoreP2), (300, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255))
		out.write(image)
		cv2.imshow('Demo', image)
		if cv2.waitKey(20) & 0xFF == 27:
			break
		# cv2.waitKey(3)
	cap.release()
	out.release()

if __name__ == "__main__":
	YOLO()