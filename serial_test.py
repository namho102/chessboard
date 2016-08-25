import serial

def read_data(string, size):
	a =[[0 for x in range(size)] for y in range(size)] 
	# print len(string)
	for i in range(0, len(string) - 2):
		# print string[i]
		a[i / size][i % size] = int(string[i])
	return a	

ser = serial.Serial('/dev/ttyACM0', 9600)
s = [0]
while True:
	read_serial = ser.readline()
	# s[0] = str(int (ser.readline(), 16))
	# print s[0]
	martrix = read_data(read_serial, 4)
	# print read_serial
	print martrix