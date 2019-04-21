# Crypto-f-the-necrodancer

client renders dodging game, needs to send id and position to server every second
server checks time to check it's approx 1 second from last sending, and position must change +1 or -1

need to store position, time in db (NOT express session)

client-server connection uses some cryptographic scheme (keep exchanging key?)
