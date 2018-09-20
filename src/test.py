import sys, json
from ecies import encrypt, decrypt

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def encrypt_data(publicKey, data):
    enc = encrypt(publicKey, json.dumps(data))
    print(enc)

def decrypt_data(privateKey, enc_data):
    dec = decrypt(privateKey, enc_data)
    print(dec.decode('utf-8'))

def main():
    #get our data as an array from read_in()
    data = read_in()

    action = data.get('action')
    if action == 'encrypt':
        encrypt_data(data.get('publicKey'), data.get('payload'))
    elif action == 'decrypt':
        decrypt_data(data.get('privateKey'), data.get('payload'))
    

    # data = b'this is a test'
    # enc = encrypt(publicKey, data)
    # dec = decrypt(privateKey, enc)
    # print(enc.decode('utf-8'))

#start process
if __name__ == '__main__':
    main()