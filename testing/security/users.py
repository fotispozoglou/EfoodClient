import time
import requests

SERVER_PROTOCOL = "http"
SERVER_IP = "192.168.1.15"
SERVER_PORT = "8000"
SERVER_URL = f"{ SERVER_PROTOCOL }://{ SERVER_IP }:{ SERVER_PORT }"

loginData = {
  "username": "fotis",
  "password": "password"
}

passwords = [
  "password1",
  "password2",
  "password3",
  "password4",
  "password5",
  "password",
  "password7",
  "password8",
  "password9",
  "password10"
]


# Testing Login Limiter
def bruteForceLogin():

    for password in passwords:

        time.sleep( 2 )

        login = requests.post(f"{ SERVER_URL }/login", { "username": "fotis", "password": password }).text

        print( login )

# Testing Register Limiter
def bruteForceRegister():

    for password in passwords:

        time.sleep( 2 )

        register = requests.post(f"{ SERVER_URL }/register", { "username": "fotis", "password": password }).text

        print( register )

bruteForceLogin()

bruteForceRegister()