X = 0
Y = 1
MaxFrames = 4
BounceSensitivity = 1.7  # How sensitive it should be to bounces. Bounded from [0, 2]. Lower values = more sensitive.
Xs = []
Ys = []
diffs = []


def col_det(location):
  global Ys, Xs, diffs, BounceSensitivity, X, Y

  bounce = False

  manage_Ys(location[Y])
  manage_Xs(location[X])

  num_Ys = len(Ys)
  num_Xs = len(Xs)
  num_diffs = len(diffs)

  if num_Ys > 1:  # At least 2 frames
    x = Xs[num_Xs - 1]
    prev_x = Xs[num_Xs - 2]
    y = Ys[num_Ys - 1]
    prev_y = Ys[num_Ys - 2]
    diff = (y - prev_y) / (x - prev_x)
    manage_diffs(diff)

  if num_diffs > 1:  # At least 3 frames
    diff = diffs[num_diffs - 1]
    prev_diff = diffs[num_diffs - 2]
    if abs(diff) + abs(prev_diff) > BounceSensitivity:
      bounce = True

  if bounce:
    Xs = []
    Ys = []
    diffs = []

  return bounce


def manage_Xs(x):
  global Xs, MaxFrames

  Xs.append(x)
  if len(Xs) == MaxFrames:
    Xs.pop(0)


def manage_Ys(y):
  global Ys, MaxFrames

  Ys.append(y)
  if len(Ys) == MaxFrames:
    Ys.pop(0)


def manage_diffs(diff):
  global diffs, MaxFrames

  diffs.append(diff)
  if len(diffs) == MaxFrames - 1:
    diffs.pop(0)
