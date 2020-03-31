from StopWatch import *
import pyttsx




class GameState:
	def __init__(self):
		self.gameInProgress =  False
		self.direction = 0
		self.timeout = 0
		self.side = ""
		self.bounce = 0 

		self.LEFT = "left"
		self.RIGHT = "right"

		#player 1 is left
		#player 2 is right
		self.scoreP1 = 0
		self.scoreP2 = 0
		self.timer = StopWatch()
		self.newGame()

	def tick(self):
		# print(timer.get_elapsed_time())
		if self.timer.isRunning():
			if self.timer.get_elapsed_time() >= 3:
				if self.side == self.LEFT:
					print('\a')
					print('\a')

					self.scoreP2 += 1
				else:
					print('\a')

					self.scoreP1 += 1
				self.timer.reset()
				#timeout has expired
		return self.scoreP1, self.scoreP2

	def addBounce(self):
		self.bounce += 1

	def inPlay(self):
		return self.timer.get_elapsed_time != 0

	def getSide(self):
		return self.side

	def updateSide(self, newSide):
		# print(newSide)
		if newSide != self.side:
			self.bounce = 0
			self.side = newSide
			self.timer.restart()

	def newGame(self):
		self.side = self.LEFT

		#setup player sides
		#player 1 left side
		#player 2 right side
		print("start a new game")

	def endGame(self):
		print("end a game")



